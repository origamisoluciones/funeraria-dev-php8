/** @var {array} obituaryImages Obituary images */
var obituaryImages = new Array;

/** @const {int} ALLOWED_MAX_IMAGES_SIZE Max allowed image size */
const ALLOWED_MAX_IMAGES_SIZE = 1;

var companyId = parseInt(getCompany());

// Select2 functions for remote data
function formatData(data){
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

// Formato para el select de expedientes de la barra inferior
function formatDataExpedients(data){
    var color = 'black'
    switch(data.status){
        case '2':
            color = 'green'
        break
        case '3':
            color = 'blue'
        break
        case '6':
            color = 'orange'
        break
    }
    return '<div style="color: ' + color + ';" id="' + data.id + '">' + data.text + '</div>';
}

/**
 * Comprueba si el expediente existe
 * 
 * @param {int} expedient Id del expediente
 * @return bool
 */
function isExpedient(expedient){
    var check

    $.ajax({
        url: uri + 'core/expedients/check.php',
        method: 'POST',
        data: {
            expedient: expedient,
            url: window.location.href
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
 * Obtiene la empresa
 * 
 * @return {int} company Empresa
 */
function getCompany(){
    var company = null

    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                company = data
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    return company
}

/**
 * Get associate expedient
 * 
 * @param {int} expedientID Expedient ID
 * @returns 
 */
function getAssociate(expedientID){
    var response = null
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociate',
            expedientID: expedientID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })
    return response
}

/**
 * Comprueba si el expediente está libre para poder acceder a él
 * 
 * @param {string} path Ruta
 */
function checkSessionExpedient(path){
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: path
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                if(data == null){
                    // window.location.reload()
                }
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
 * Gets obituary images
 */
function getObituaryImages(expedient){
    var images = null;
    $.ajax({
        url: uri + 'core/expedients/obituary/images/get.php',
        method: 'POST',
        data: {
            expedient: expedient
        },
        async: false,
        success: function(data){
            try{
                images = $.parseJSON(data);
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
        }
    })

    if(images != null){
        obituaryImages = images;
        drawImages(expedient);
    }
}

/**
 * Draws images
 * 
 * @param {int} expedient Expedient
 */
function drawImages(expedient){
    $('#obituariesImages').empty();

    if(obituaryImages.length == 0){
        $('#obituariesImages').append('<tr><td colspan="4">Todavía no se ha subido ninguna esquela</td></tr>')
        return false;
    }

    $.each(obituaryImages, function(index, elem){
        var html =
            '   <tr index="' + index + '" expedient="' + expedient + '">' +
            '       <td class="d-none id">' + elem.id + '</td>' +
            '       <td class="text-center">' +
            '           <input type="checkbox" id="main' + index + '" ' + (elem.main == '1' ? 'checked disabled' : '') + '>' +
            '       </td>' +
            '       <td>' +
            '           <div class="d-flex align-items-center">' +
            '               <img width="100px" class="obituary-img" src="' + uri + 'resources/files/' + companyId + '/expedients/' + expedient + '/obituary-images/' + elem.name + '" alt="Imagen esquela">' +
            '               <span class="ml-2">' + elem.name + '</span>' +
            '           </div>' +
            '       </td>' +
            '       <td class="text-center">' +
            '           <button class="btn btn-danger" id="deleteImage' + index + '" ' + (elem.main == '1' && obituaryImages.length > 1 ? 'disabled' : '') + '>Eliminar</button>' +
            '       </td>' +
            '   </tr>'
        ;

        $('#obituariesImages').append(html);

        // Image
        $('.obituary-img').click(function(){
            var src = $(this).attr('src');
            $('#previewImageModal #imageSrc').attr('src', src);

            $('#previewImageModal').modal('show');
        })

        // Main
        $('#main' + index).click(function(){
            if($(this).prop('checked')){
                if(confirm('¿Deseas marca esta imagen como imagen principal de la esquela?')){
                    var id = parseInt($(this).closest('tr').find('td.id').text());
                    var expedient = parseInt($(this).closest('tr').attr('expedient'));
                    
                    markAsMain(id, expedient);
                }else{
                    $(this).prop('checked', false);
                }
            }
        })

        // Delete
        $('#deleteImage' + index).click(function(){
            if(confirm('¿Deseas eliminar la imagen de la esquela?')){
                var id = parseInt($(this).closest('tr').find('td.id').text());
                var expedient = parseInt($(this).closest('tr').attr('expedient'));

                deleteImage(id, expedient);
            }
        })
    })
}

/**
 * Marks an image as main
 * 
 * @param {int} id Id
 * @param {int} expedient Expedient
 */
function markAsMain(id, expedient){
    $.ajax({
        url: uri + 'core/expedients/obituary/images/markAsMain.php',
        method: 'POST',
        data: {
            id: id,
            expedient: expedient
        },
        async: false,
        success: function(data){
            try{
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La imagen ha sido marcada como principal.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);

                getObituaryImages(expedient);
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
        }
    })
}

/**
 * Deletes an image
 * 
 * @param {int} id Id
 * @param {int} expedient Expedient
 */
function deleteImage(id, expedient){
    $.ajax({
        url: uri + 'core/expedients/obituary/images/delete.php',
        method: 'POST',
        data: {
            id: id,
            expedient: expedient
        },
        async: false,
        success: function(data){
            try{
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La imagen ha sido eliminada con éxito.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);

                getObituaryImages(expedient);
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
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
    changeSpaceFooter();
    setWidthBottomToolbar();
})

$(function(){
    // Toolbar Bottom
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    
    changeSpaceFooter()
    
    $('#backLink').click(function(event){
        $('#saveForm').click();
        event.preventDefault(); 
        
        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    });

    $('#exitExpedient').click(function(){
        window.location.href = uri + 'expedientes';
    })

    moment.locale('es');

    setWidthBottomToolbar();

    // Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    // Go Top
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
            return false;
    });
    var limit_page = 10;
    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ...";
        },
        inputTooLong: function(args) {
            return "Término demasiado largo";
        },
        errorLoading: function() {
            return "Sin resultados";
        },
        loadingMore: function() {
            return "Cargando más resultados";
        },
        noResults: function() {
            return "No hay resultados";
        },
        searching: function() {
            return "Buscando...";
        },
        maximumSelected: function(args) {
            return "Sin resultados";
        }
    };

    // Listar expedientes
    $('#getAllExpedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: 'Cambiar de expediente',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expedients/obituary/listExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page                 
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return{
                            text: item.number,
                            id: item.expedientID,
                            status: item.status,
                            tpv: item.tpv
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataExpedients,
        templateSelection: formatDataExpedients
    });

    var block = false
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: window.location.pathname
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data != null){
                    $('#expedientBlocked').removeClass('hide')
                    $('#firstUser').html(data[0].name + ' ' + data[0].surname)

                    block = true
                    $('#saveForm').remove()
                    $('#backLink').remove()
                    $('#reload').remove()
                    $('input').attr('disabled', true)
                    $('select').attr('disabled', true)
                    $('textarea').attr('disabled', true)
                    $('.addModel').remove()
                } 
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

    if(block){
        setInterval(function(){
            checkSessionExpedient(window.location.pathname)
        }, 3000)
    }

    $('#goToExpedient').click(function() {   
        expid = $('#getAllExpedients').val();    
        if(expid != null){            
            window.location.href = uri + 'expediente/esquela/' + expid;
        }
    })

    var expedientID = $('#expedientID').val();
    if(isExpedient(expedientID)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }

    var associateExpedient = getAssociate(expedientID)
    if(associateExpedient != null){
        if(associateExpedient.deceasedName == ''){
            $('#expedientAssociate').html(associateExpedient.number)
            $('#associateNav').html(associateExpedient.number)
        }else{
            $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
            $('#associateNav').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
        }
        $('#associatedData').removeClass('hide')
    }

    $.ajax({
        url: uri+"core/expedients/logs/functions.php",
        type: 'POST',
        data: {type: 'getExpedient', expedient: expedientID},
        async: false,
        success: function (data){
            data = $.parseJSON(data)[0];
            var gender = ''
            if(data.deceasedGender == 'Mujer'){
                gender = "Dña. "
            }else{
                gender = "D. "
            }
            $('.deceasedName').text(' ' + gender + ' ' + data.deceasedName + ' ' + data.deceasedSurname);
            $('#expNumber').text(data.number);
            $('.numExp').text(data.number);
        }
    });

    $('#reactived').remove();

    // Gets images
    getObituaryImages(expedientID);

    // Upload image
    $('#uploadFile').click(function(){
        var inputFile = document.getElementById('fileAttachDoc');
        var files = inputFile.files;
        var flag = true;
        var validate = 0;
        if(files.length == 0){
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún archivo</div>');
            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
            return false;
        }
        var time = moment().format('X');
        var filesUpload = new Array;

        var flagFormat = true;
        var flagSize = true;
        for(var i = 0; i < files.length; i++){
            var mimeType = files[i].type;
            var size = files[i].size;

            var flagUp = true;
            if(mimeType != 'image/jpeg' && mimeType != 'image/png'){
                flag = false;
                flagUp = false;
                flagFormat = false;
            }

            if(size > ALLOWED_MAX_IMAGES_SIZE * 1024 * 1024){
                flag = false;
                flagUp = false;
                flagSize = false;
            }

            if(flagUp){
                filesUpload.push(files[i]);
            }

            time++;
        }

        if(flag){
            var data = new FormData();
            data.append('expedientID', expedientID);
            $.each(filesUpload, function(index, elem){
                data.append('image-' + index, elem);
            })
            $.ajax({
                url: uri + "core/expedients/obituary/images/upload.php",
                type: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    try{
                        
                    }catch(e){
                        validate++
                    }
                },
                error: function(){
                    validate++
                }
            })
    
            if(validate == 0){
                $('#fileAttachDoc').val('')
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las imagénes se han subido correctamente.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }

            getObituaryImages(expedientID);
        }else{
            $('#fileAttachDoc').val('')
            if(!flagFormat){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunas imágenes non se han subido porque tienen un formato de archivo no permitido (.jpg, .png).</div>');

                
            }else if(!flagSize){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunas imágenes non se han subido porque no tienen un peso adecuado (máximo ' + ALLOWED_MAX_IMAGES_SIZE + ' MB).</div>');
            }

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    });
})