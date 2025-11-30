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
            var data = $.parseJSON(data);
            if(data!=='false' && data != false){
                $('#modal-slides-panelinfo .modal-body .current-photos ul').html('');
                $('#slide .carousel-inner').html('');
                data.forEach(function(element, index) {
                    //Integramos las fotos en la vista previa de la modal para su gestión
                    $('#modal-slides-panelinfo .modal-body .current-photos ul').append('<li><a class="btnDeleteImage"  title="Borrar imagen"><img id="' + element + '" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuaryID + '/slides/' + element + '" class="img-thumbnail"></a></li>');
                    
                    var active = '';
                    if(index==0){
                        active= ' active';
                    }else{
                    }
                    $('#slide .carousel-inner').append('<div class="item' + active + '"><img width="300px" id="' + element + '" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuaryID + '/slides/' + element + '" class="img-responsive"></div>');
                    $('#slide').carousel('next');
                    /*$('#slide-footer .carousel-inner').append('<div class="item' + active + '"><img width="300px" class="img-responsive" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuaryID + '/slides/' + element + '">')
                    $('#slide-footer').carousel('next');*/
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

                //Recorrer el Objeto data que contiene slides
                var i = 0
                for (key in data) {
                    
                    if(key != 'imgs'){
                        
                        //Buscar el ID en el array de imagenes para saber si existe
                        if(arrayImgs.indexOf(data[key]['ID']) != -1 ){ //existe imagen
                                         
                            id = data[key]["ID"]
                            title = data[key]["title"]
                            message = data[key]["message"]
                            
                            if(i==0){
                                $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                                '       <div class="row">' +
                                                                                '           <div class="col-xs-6">' +
                                                                                '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide' + id + '.png">' +
                                                                                '           </div>' +
                                                                                '           <div class="col-xs-6" style="text-align: left;">' +
                                                                                '               <p>' + title + '</p>' +
                                                                                '               <p style="white-space: pre-wrap;">' + message + '</p>' +
                                                                                '           </div>' +
                                                                                '       </div>' +
                                                                                '   </div>')
                            }else{
                                $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                                '       <div class="row">' +
                                                                                '           <div class="col-xs-6">' +
                                                                                '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide' + id + '.png">' +
                                                                                '           </div>' +
                                                                                '           <div class="col-xs-6" style="text-align: left;">' +
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
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + title + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + title + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                            }else{
                                $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + title + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + title + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                            }
                        }  
                        i++                      
                    }    
                }

                $('#carousel-footer').carousel({
                    interval: 5000,
                    pause: "false"
                })
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
 * Función para eliminar una foto de transición. Para lo cual debemos especificar tanatorio y nombre de la imagen
 * 
 * @param mortuaryID 
 * @param filename 
 */
function deleteImagePanelInfo(mortuaryID, filename){
    var result = true;
    $.post(uri+"core/panelInfo/functions.php", {type: 'deleteImagePanelInfo', mortuaryID: mortuaryID, filename: filename}, function(data){
        result = data;
    })
    return result;
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

//Obtiene los slides de un tanatorio
function getSlidesForMortuary(mortuaryID){
    var result = null   
    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'getIDSlidesForMortuary',
            mortuary: mortuaryID
        },
        async: false,
        success: function(data){
            try{
                if(data != null){
                    result = $.parseJSON(data)
                }else{
                    result = null
                }
            }catch(e){
                result = null
            }
        },
        error: function(){
            result = null
        }
    })
    return result    
}

/* *********************************************************************************** */
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
 * Carga la configuración del slider del header
 * 
 * @param {int} mortuary Tanatorio
 */
function loadHeaderConf(mortuary){
    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'getSlideHeader',
            mortuary: mortuary
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                $('#modal-slides-panelinfo #currentSlider').empty()

                if(data == null){
                    $('#modal-slides-panelinfo #currentSlider').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El slider no tiene ninguna foto</div>')
                }else{
                    $.each(data, function(index, elem){
                        var name = elem.split('/')[elem.split('/').length - 1]
                        var id = (elem.split('/')[elem.split('/').length - 1]).split('.')[0]
                        $('#modal-slides-panelinfo #currentSlider').append( '   <img class="panelInfoSlideModal" src="' + uri + elem + '" name="' + name + '" id="' + id + '" alt="imagen slider">' +
                                                                            '   <button class="btn btn-danger delete" id="btn' + id + '"><i class="fa fa-trash" aria-hidden="true"></i></button>')
                    })
                }

                $('#modal-slides-panelinfo .delete').click(function(){
                    var id = $(this).attr('id').substring(3)
                    var img = $(this).closest('div').find('#' + id).attr('name')

                    $(this).closest('div').find('#' + id).remove()
                    $(this).closest('div').find('#btn' + id).remove()

                    $.ajax({
                        url: uri + 'core/panelInfo/functions.php',
                        method: 'POST',
                        data: {
                            type: 'deleteSlideUp',
                            mortuary: mortuary,
                            img: img
                        },
                        dataType: 'json',
                        async: true,
                        success: function(data){
                            if(data){
                                var mortuaryInfo = getMortuaryInfo(mortuary)
                                loadSlide(mortuaryInfo[2])
                            }
                        }
                    })
                })
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

function getSlidesSelect(mortuary){
    $('#modal-panelInfo-footer #slidesSelect').empty()
    $('#modal-panelInfo-footer #slidesSelect').append('<option selected disabled hidden>Selecciona un slide</option>')
    $('#modal-panelInfo-footer #slideInfo').addClass('hide')
    
    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'getSlidesDown',
            mortuary: mortuary
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                if(data != null){
                    $.each(data, function(index, elem){
                        var i = index + 1
                        $('#modal-panelInfo-footer #slidesSelect').append('<option value="' + elem.ID + '">Slide ' + i + '</option>')
                    })
                }

                $('#modal-panelInfo-footer').modal('show')
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
 * Elimina una imagen de un slider
 * 
 * @param {int} mortuary Tanatorio
 * @param {int} slide Slide
 */
function slideImgDelete(mortuary, slide){
    $('.slideImgDelete').click(function(){
        var btn = $(this)
        $.ajax({
            url: uri + 'core/panelInfo/functions.php',
            method: 'POST',
            data: {
                type: 'slideImgDelete',
                slide: slide,
                mortuary: mortuary
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    if(data){
                        btn.closest('div').empty()
                    }else{

                    }
                }catch(e){

                }
            },
            error: function(){

            }
        })
    })
}

/**
 * Carga las fotos en el slide del footer
 * 
 * @param {array} data Fotos
 */
function loadFooterSlide(data){
    $('#carouselDownContent').html('')

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
    var mortuary = $('#mortuaryID').val()
    if(existsMortuary(mortuary)){
        $('#existsMortuary').remove()
    }else{
        $('#existsMortuary').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'configuracion/panel-informativo'
        }, 2500)
        return false
    }

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .tn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    
    $('#backLink').click(function(event) {
        event.preventDefault()
        
        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({
            scrollTop : 0
        }, 800)
        return false
    })
    
    // Información del tanatorio
    var mortuaryInfo = getMortuaryInfo(mortuary)
    $('.footer-static-bottom .block-2 .btn-gotop').before('<a href="' + uri + 'configuracion/panel-informativo/vista-previa/' + mortuary + '" class="btn btn-primary" target="_blank"><i class="fa fa-eye" aria-hidden="true"></i> VISTA PREVIA</a>')
    changeSpaceFooter()
    
    // Tabla de contenido
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

    $('#slide').carousel({
        interval: 4000,
        pause: "false"
    })

    $('#carouselDown').carousel({
        interval: 7000,
        cycle: true
    })

    $('#headerConf').click(function(){
        loadHeaderConf(mortuary)

        $('#modal-slides-panelinfo').modal('show')
    })

    $('#modal-slides-panelinfo #upload').click(function(){
        $('#modal-slides-panelinfo #emptyError').addClass('hide')
        var file = document.getElementById('fileSlideUp').files[0]
        if(file != undefined){
            var filename = file.name.split('.')
            var extension = filename[filename.length - 1]
            
            switch(extension.toLowerCase()){
                case 'jpg':
                case 'jpeg':
                case 'png':
                    $('#modal-slides-panelinfo #formatError').addClass('hide')
                    break
                    
                default:
                    $('#modal-slides-panelinfo #formatError').removeClass('hide')
                    return false
                    break
            }
    
            var data = new FormData
            data.append('mortuary', mortuary)
            data.append('type', 'addSlideUp')
            data.append('file', file)
            
            $.ajax({
                url: uri + 'core/panelInfo/functions.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    $('#modal-slides-panelinfo #formatError').addClass('hide')
                    $('#modal-slides-panelinfo #error').addClass('hide')
                    $('#modal-slides-panelinfo #success').addClass('hide')
                    try{
                        switch(data){
                            case 'format':
                                $('#modal-slides-panelinfo #formatError').removeClass('hide')
                                $('#modal-slides-panelinfo #error').addClass('hide')
                                $('#modal-slides-panelinfo #success').addClass('hide')
                                $('#modal-slides-panelinfo #fileSlideUp').val('')
                                break

                            case false:
                                $('#modal-slides-panelinfo #error').removeClass('hide')
                                $('#modal-slides-panelinfo #formatError').addClass('hide')
                                $('#modal-slides-panelinfo #success').addClass('hide')
                                $('#modal-slides-panelinfo #fileSlideUp').val('')
                                break

                            case true:
                                $('#modal-slides-panelinfo #success').removeClass('hide')
                                $('#modal-slides-panelinfo #formatError').addClass('hide')
                                $('#modal-slides-panelinfo #error').addClass('hide')
                                $('#modal-slides-panelinfo #fileSlideUp').val('')
                                $('#modal-slides-panelinfo #fileSlideUp').val('')
                                loadHeaderConf(mortuary)
                                var mortuaryInfo = getMortuaryInfo(mortuary)
                                loadSlide(mortuaryInfo[2])
                                break
                        }
                    }catch(e){
                        $('#modal-slides-panelinfo #error').removeClass('hide')
                        $('#modal-slides-panelinfo #formatError').addClass('hide')
                        $('#modal-slides-panelinfo #success').addClass('hide')
                        $('#modal-slides-panelinfo #fileSlideUp').val('')
                    }
                },
                error: function(){
                    $('#modal-slides-panelinfo #error').removeClass('hide')
                    $('#modal-slides-panelinfo #formatError').addClass('hide')
                    $('#modal-slides-panelinfo #success').addClass('hide')
                    $('#modal-slides-panelinfo #fileSlideUp').val('')
                }
            })
        }else{
            $('#modal-slides-panelinfo #emptyError').removeClass('hide')
            $('#modal-slides-panelinfo #formatError').addClass('hide')
            $('#modal-slides-panelinfo #error').addClass('hide')
            $('#modal-slides-panelinfo #success').addClass('hide')
            $('#modal-slides-panelinfo #fileSlideUp').val('')
        }
    })

    $('#modal-slides-panelinfo').on('hidden.bs.modal', function(){
        $('#modal-slides-panelinfo #formatError').addClass('hide')
        $('#modal-slides-panelinfo #error').addClass('hide')
        $('#modal-slides-panelinfo #success').addClass('hide')
        $('#modal-slides-panelinfo #fileSlideUp').val('')
    })

    // Slides (inferior)
    $('#footerConf').click(function(){
        $('#modal-panelInfo-footer #slidesSelect').empty()
        $('#modal-panelInfo-footer #slidesSelect').append('<option selected disabled hidden>Selecciona un slide</option>')
        $('#modal-panelInfo-footer #slideInfo').addClass('hide')
        $('#modal-panelInfo-footer #slideImg').val('')
        $('#modal-panelInfo-footer #slideTitle').val('')
        $('#modal-panelInfo-footer #slideText').val('')

        getSlidesSelect(mortuary)
    })

    $('#modal-panelInfo-footer #slidesSelect').change(function(){
        $('#modal-panelInfo-footer #uploadImg').val('')
        $('#modal-panelInfo-footer #slideImg').empty()
        
        var slide = $(this).val()
        $.ajax({
            url: uri + 'core/panelInfo/functions.php',
            method: 'POST',
            data: {
                type: 'getInfoSlide',
                slide: slide
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    $('#modal-panelInfo-footer #slideTitle').val(data[0].title)
                    $('#modal-panelInfo-footer #slideText').val(data[0].message)
                    if(data[0].file != undefined){
                        $('#modal-panelInfo-footer #slideImg').append(  '   <img class="panelInfoSlideModal" src="' + uri + data[0].file + '" alt="imagen slide">' +
                                                                        '   <button class="btn btn-danger slideImgDelete"><i class="fa fa-trash" aria-hidden="true"></i></button>')
                    }else{
                        $('#modal-panelInfo-footer #slideImg').empty()
                    }

                    slideImgDelete(data[0].mortuary, data[0].ID)
                }catch(e){
                    $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                    setTimeout(function(){
                        $('#modal-panelInfo-footer #message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                setTimeout(function(){
                    $('#modal-panelInfo-footer #message').empty()
                }, 5000)
            }
        })

        $('#slideInfo').removeClass('hide')
    })

    $('#modal-panelInfo-footer #saveFooter').click(function(){
        var slide = $('#modal-panelInfo-footer #slidesSelect').val()
        if(slide != null){
            var validate = 0

            var title = $('#modal-panelInfo-footer #slideTitle').val()
            var message = $('#modal-panelInfo-footer #slideText').val()
            var file = document.getElementById('uploadImg').files[0] == undefined ? null : document.getElementById('uploadImg').files[0]

            if(file != null){
                var filename = file.name.split('.')
                var extension = filename[filename.length - 1]
                
                switch(extension.toLowerCase()){
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                        $('#modal-slides-panelinfo #formatError').addClass('hide')
                        break
                        
                    default:
                        $('#modal-slides-panelinfo #formatError').removeClass('hide')
                        return false
                        break
                }
            }

            var data = new FormData
            data.append('type', 'updateSlideFooter')
            data.append('mortuary', mortuary)
            data.append('slide', slide)
            data.append('title', title)
            data.append('message', message)
            data.append('file', file)

            $.ajax({
                url: uri + 'core/panelInfo/functions.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    try{
                        switch(data){
                            case true:
                                $('#modal-panelInfo-footer #message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El slide se ha guardado con éxito.</div>');
            
                                setTimeout(function(){
                                    $('#modal-panelInfo-footer #message').empty()
                                }, 5000)

                                var mortuaryInfo = getMortuaryInfo(mortuary)
                                loadFooterSlide(mortuaryInfo[3])
                                break

                            case false:
                            case 'error':
                                $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
            
                                setTimeout(function(){
                                    $('#modal-panelInfo-footer #message').empty()
                                }, 5000)
                                break
                            
                            case 'format':
                                $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La imagen tiene un formato incorrecto (jpg, jpeg o png).</div>');
            
                                setTimeout(function(){
                                    $('#modal-panelInfo-footer #message').empty()
                                }, 5000)
                                break

                            default:
                                $('#modal-panelInfo-footer #slideImg').empty()
                                $('#modal-panelInfo-footer #slideImg').append('<img class="panelInfoSlideModal" src="' + uri + data + '" alt="Imagen slide">')
                                $('#modal-panelInfo-footer #uploadImg').val('')

                                $('#modal-panelInfo-footer #message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El slide se ha guardado con éxito.</div>');
        
                                setTimeout(function(){
                                    $('#modal-panelInfo-footer #message').empty()
                                }, 5000)

                                var mortuaryInfo = getMortuaryInfo(mortuary)
                                loadFooterSlide(mortuaryInfo[3])
                                break
                        }
                    }catch(e){
                        $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                
                        setTimeout(function(){
                            $('#modal-panelInfo-footer #message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                
                    setTimeout(function(){
                        $('#modal-panelInfo-footer #message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-panelInfo-footer #message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debes seleccionar un slide para poder guardarlo.</div>');
                
            setTimeout(function(){
                $('#modal-panelInfo-footer #message').empty()
            }, 5000)
        }
    })

    $('#modal-panelInfo-footer #addSlide').click(function(){
        $.ajax({
            url: uri + 'core/panelInfo/functions.php',
            method: 'POST',
            data: {
                type: 'addSlideFooter',
                mortuary: mortuary
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    if(data){
                        getSlidesSelect(mortuary)

                        $('#modal-panelInfo-footer #message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El slide se ha creado con éxito.</div>');
                    
                        setTimeout(function(){
                            $('#modal-panelInfo-footer #message').empty()
                        }, 5000)
                    }else{
                        $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                    
                        setTimeout(function(){
                            $('#modal-panelInfo-footer #message').empty()
                        }, 5000)
                    }
                }catch(e){
                    $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                
                    setTimeout(function(){
                        $('#modal-panelInfo-footer #message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                
                setTimeout(function(){
                    $('#modal-panelInfo-footer #message').empty()
                }, 5000)
            }
        })
    })

    $('#modal-panelInfo-footer #removeSlide').click(function(){
        var slide = $('#modal-panelInfo-footer #slidesSelect').val()
        if(slide == null){
            $('#modal-panelInfo-footer #message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Selecciona un slide</div>');
                        
            setTimeout(function(){
                $('#modal-panelInfo-footer #message').empty()
            }, 5000)
        }else{
            $.ajax({
                url: uri + 'core/panelInfo/functions.php',
                method: 'POST',
                data: {
                    type: 'deleteSlideFooter',
                    mortuary: mortuary,
                    slide: slide
                },
                dataType: 'json',
                async: false,
                success: function(data){
                    try{
                        if(data){
                            getSlidesSelect(mortuary)
    
                            $('#modal-panelInfo-footer #message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El slide se ha eliminado con éxito.</div>');
                        
                            setTimeout(function(){
                                $('#modal-panelInfo-footer #message').empty()
                            }, 5000)

                            var mortuaryInfo = getMortuaryInfo(mortuary)
                            loadFooterSlide(mortuaryInfo[3])
                        }else{
                            $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                        
                            setTimeout(function(){
                                $('#modal-panelInfo-footer #message').empty()
                            }, 5000)
                        }
                    }catch(e){
                        $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                    
                        setTimeout(function(){
                            $('#modal-panelInfo-footer #message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#modal-panelInfo-footer #message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error mientras se procesaba su solicitud.</div>');
                    
                    setTimeout(function(){
                        $('#modal-panelInfo-footer #message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Mensaje
    $('#msgConfig').on('click', function(){ 
        $.ajax({
            url: uri + 'core/panelInfo/functions.php',
            method: 'POST',
            data: {
                type: 'getPanelMessage',                
                mortuary: mortuary               
            },
            async: false,
            success: function(data){
                if(data != null && data !='null'){
                    data = $.parseJSON(data)
                    $('#modal-message-panelinfo #messageText').val(data[0].message)
                    if(data[0].showMsg == 1){
                        $('#modal-message-panelinfo #showMessage').prop('checked', true)
                    }else{
                        $('#modal-message-panelinfo #showMessage').prop('checked', false)
                    }
                }else{
                    $('#modal-message-panelinfo #messageText').val('')
                    $('#modal-message-panelinfo #showMessage').prop('checked', false)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        $('#modal-message-panelinfo').modal('show') 
    })

    $('#modal-message-panelinfo #saveMessage').on('click', function(){    
        message = $('#modal-message-panelinfo #messageText').val()
        show = $('#modal-message-panelinfo #showMessage').prop('checked')
        if(show){
            showMsg = 1
        }else{
            showMsg = 0
        }
        
        $.ajax({
            url: uri + 'core/panelInfo/functions.php',
            method: 'POST',
            data: {
                type: 'addPanelMessage',                
                mortuary: mortuary,
                message: message,
                showMsg: showMsg
            },
            async: false,
            success: function(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mensaje se ha guardado con éxito.</div>');
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
        $('#modal-message-panelinfo').modal('hide')      

    })

    $('#modal-message-panelinfo').on('hidden.bs.modal', function(){       
        $('#modal-message-panelinfo #messageText').val('')
        $('#modal-message-panelinfo #showMessage').prop('checked', false)
    })

    // TIEMPOS INTERVALOS
    $('#timeConfig').on('click', function(){ 
        $.ajax({
            url: uri + 'core/panelInfo/functions.php',
            method: 'POST',
            data: {
                type: 'getTimes',                
                mortuary: mortuary               
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
                if(data != null){
                    $('#modal-times-panelInfo #timeUpSlide').val(data[0].upSlide/1000)
                    $('#modal-times-panelInfo #timeDownSlide').val(data[0].downSlide/1000)
                    $('#modal-times-panelInfo #ID').val(data[0].ID)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
        $('#modal-times-panelInfo').modal('show') 
    })

    $('#saveTime').click(function(){
        var validate = 0;

        if($('#modal-times-panelInfo #timeUpSlide').val() == null || $('#modal-times-panelInfo #timeUpSlide').val() == ''){
            validate++;
        }
        if($('#modal-times-panelInfo #timeDownSlide').val() == null || $('#modal-times-panelInfo #timeDownSlide').val() == ''){
            validate++;
        }

        if(validate == 0){
            var upTime = $('#modal-times-panelInfo #timeUpSlide').val() * 1000
            var downTime = $('#modal-times-panelInfo #timeDownSlide').val() * 1000
            var ID = $('#modal-times-panelInfo #ID').val()
            $.ajax({
                url: uri + 'core/panelInfo/functions.php',
                method: 'POST',
                data: {
                    type: 'addTimes',                
                    mortuary: mortuary,
                    upTime:upTime,
                    downTime: downTime,
                    ID: ID    
                },
                async: false,
                success: function(data){
                    $('#modal-times-panelInfo #msg').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se han añadido los tiempos correctamente.</div>');
                    
                    setTimeout(function(){
                        $('#modal-times-panelInfo #msg').empty()
                        $('#modal-times-panelInfo').modal('hide')   
                    }, 1500)
                   
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })
})