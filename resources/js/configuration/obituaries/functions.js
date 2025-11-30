/** @var array images Images */
var images = new Array

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

/**
 * Gets images
 */
function getImages(){
    $('#imagesObituary').empty()

    $.ajax({
        url: uri + 'core/obituaries/functions.php',
        method: 'POST',
        data: {
            type: 'listDir'
        },
        async: false,
        dataType: 'json',
        success: function(data){
            try{
                images = data
                printImages()
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
 * Prints images
 */
function printImages(){
    if(images.length == 0){
        $('#imagesObituary').append(
            '<div class="alert alert-warning">No se hay imágenes para mostrar</div>'
        )
        return false
    }

    $('#imagesObituary').append(
        '   <div class="table-responsive">' +
        '       <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
        '           <thead>' +
        '               <tr>' +
        '                   <th class="hide">Index</th>' +
        '                   <th class="hide">Source</th>' +
        '                   <th>Imagen</th>' +
        '                   <th width="10%" class="text-center">Ver</th>' +
        '                   <th width="10%" class="text-center">Eliminar</th>' +
        '               </tr>' +
        '           </thead>' +
        '           <tbody id="bodyImages">' +
        '           </tbody>' +
        '       </table>' +
        '   </div>'
    )
    $.each(images, function(index, elem){
        $('#bodyImages').append(
            '   <tr>' +
            '       <td class="hide">' + index + '</td>' +
            '       <td class="hide">' + elem.img + '</td>' +
            '       <td>' + elem.name + '</td>' +
            '       <td class="text-center"><a href="#" class="btn-edit" title="Ver"><i class="fa fa-eye" aria-hidden="true"></i></a></td>' +
            '       <td class="text-center"><a href="#" class="btn-delete" title="Eliminar"><i class="fa fa-trash" aria-hidden="true"></i></a></td>' +
            '   </tr>'
        )
    })

    $('.btn-edit').click(function(){
        var index = $($(this).closest('tr').find('td')[0]).text()
        
        $('#showImgModal #imageShow').attr('src', images[index].img)

        $('#showImgModal').modal('show')
    })

    $('.btn-delete').click(function(){
        var index = $($(this).closest('tr').find('td')[0]).text()
        
        if(confirm('¿Deseas eliminar la imagen?')){
            $.ajax({
                url: uri + 'core/obituaries/functions.php',
                method: 'POST',
                data: {
                    type: 'deleteImage',
                    name: images[index].name
                },
                async: false,
                dataType: 'json',
                success: function(data){
                    try{
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La imagen ha sido eliminada</div>');
        
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        getImages()
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
    })
}

$(function(){
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
    $('#backLink').click(function(event){
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    getImages();

    // Add image
    $('#addImage').click(function(){
        $('#addImageModal').modal('show')
    })

    $('#addImageInput').change(function(){
        if($(this)[0].files.length == 0){
            $('#addImageModal #tempImageName').html('')
            return false
        }

        $('#addImageModal #tempImageName').html($(this)[0].files[0].name)
    })

    $('#addImageModal').on('hidden.bs.modal', function(){
        $('#addImageWarning').addClass('hide')
        $('#addImageInput').val(null).trigger('change')
        $('#addImageTypeWarning').addClass('hide');
    })

    $('#goAddImage').click(function(){
        var validate = 0

        if($('#addImageModal #addImageInput')[0].files.length == 0){
            validate++
        }

        $('#addImageWarning').addClass('hide');
        if(validate > 0){
            $('#addImageWarning').removeClass('hide');
            return false;
        }

        $('#addImageTypeWarning').addClass('hide');
        if($('#addImageModal #addImageInput')[0].files[0].type != 'image/png'){
            $('#addImageTypeWarning').removeClass('hide');
            return false;
        }
        
        var formData = new FormData()
        formData.append('type', 'addImage')
        formData.append('file', $('#addImageModal #addImageInput')[0].files[0])

        $.ajax({
            url: uri + 'core/obituaries/functions.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            async: false,
            success: function(data){
                try{
                    if(data){
                        getImages()

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La imagen ha sido subida</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }

                $('#modal-edit-obituary').modal('hide')
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        $('#addImageModal').modal('hide')
    })


    /******************* ESQUELAS DE ANIVERSARIO *******************/

    $("#activateObituaryAnniversaryReminder").change(function(){

        if($(this).prop('checked')){
            $('.activated-reminders').removeClass('hide');
        }else{
            $("#reminderObituaryAnniversaryParticulars").prop('checked', false);
            $("#reminderObituaryAnniversaryEnterprises").prop('checked', false);
            $("#reminderObituaryAnniversaryInsurances").prop('checked', false);

            $('.activated-reminders').addClass('hide');
        }

    })

    var infoReminders = getObituaryAnniversaryReminder();
    if(infoReminders != null){
        if(parseInt(infoReminders.activateObituaryAnniversaryReminder) == 1){
            $("#activateObituaryAnniversaryReminder").prop('checked', true).trigger('change');

            if(parseInt(infoReminders.reminderObituaryAnniversaryParticulars) == 1){
                $("#reminderObituaryAnniversaryParticulars").prop('checked', true);
            }

            if(parseInt(infoReminders.reminderObituaryAnniversaryEnterprises) == 1){
                $("#reminderObituaryAnniversaryEnterprises").prop('checked', true);
            }

            if(parseInt(infoReminders.reminderObituaryAnniversaryInsurances) == 1){
                $("#reminderObituaryAnniversaryInsurances").prop('checked', true);
            }
        }
    }

    $("#saveRemindersOptions").click(function(){

        var activateObituaryAnniversaryReminder = 0;
        var reminderObituaryAnniversaryParticulars = 0;
        var reminderObituaryAnniversaryEnterprises = 0;
        var reminderObituaryAnniversaryInsurances = 0;
        if($("#activateObituaryAnniversaryReminder").prop('checked')){
            activateObituaryAnniversaryReminder = 1;

            if($("#reminderObituaryAnniversaryParticulars").prop('checked')){
                reminderObituaryAnniversaryParticulars = 1;
            }
            if($("#reminderObituaryAnniversaryEnterprises").prop('checked')){
                reminderObituaryAnniversaryEnterprises = 1;
            }
            if($("#reminderObituaryAnniversaryInsurances").prop('checked')){
                reminderObituaryAnniversaryInsurances = 1;
            }
        }

        $.post(uri + 'core/settings/functions.php', {type:'updateObituaryAnniversary', activateObituaryAnniversaryReminder : activateObituaryAnniversaryReminder, reminderObituaryAnniversaryParticulars : reminderObituaryAnniversaryParticulars, reminderObituaryAnniversaryEnterprises : reminderObituaryAnniversaryEnterprises, reminderObituaryAnniversaryInsurances: reminderObituaryAnniversaryInsurances}, function(data){
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La configuración de la esquela de aniversario se ha actualizado con éxito.</div>')
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            }

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        })
    })

})

/**
 * Gets obituary anniversary configuration
 */
function getObituaryAnniversaryReminder(){
    var info = null;

    $.ajax({
        url: uri + 'core/settings/functions.php',
        method: 'POST',
        data: {
            type: 'getObituaryAnniversary'
        },
        async: false,
        dataType: 'json',
        success: function(data){
            try{
                info = data;
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

    return info;
}