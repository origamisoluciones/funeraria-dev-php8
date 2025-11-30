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
 * Logs update
 * 
 * @param int expedient Id del expediente
 */
function logCreateDocument(expedient, doc){
    $.ajax({
        url: uri + 'core/expedients/services/functions.php',
        method: 'POST',
        data: {
            type: 'logCreateDocument',
            expedient: expedient,
            doc: doc
        },
        async: false
    })
}

//Función que pasando como parámetro el ID se obtienen todos los datos (cp, provincia...)
function processPDF(docName, text, service, radio, fileName = '') {
    $.ajax({
        url: uri + "core/libraries/pdfs/process.php",
        data: {doc: docName, text: text, expedientID: service, radio: radio, fileName : fileName},
        type: 'POST',
        async: false
    });
}

function getUserID(){
    var user;
    $.ajax({

        url: uri+"core/users/functions2.php",
        data: {type: 'getUser'},
        type: 'POST',
        async: false,
        success: function (data) {
            user = $.parseJSON(data);            
        }
    });
    return user[0].userID;
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
    //Toolbar Bottom
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="export" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>');
    changeSpaceFooter()
    $('#backLink').click(function(event) {
        event.preventDefault(); 

        history.back(1);

        // if(document.referrer == ''){
        //     history.back(1);
        // }else{
        //     if(window.location.href == document.referrer){
        //         history.back(1);
        //     }else{
        //         window.location.href = document.referrer;
        //     }
        // }
    });

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    var company = getCompany()

    var radio = '';
    var docName = $('#docName').val();
    var service = $('#service').val();

    if(docName == 'resumenServicio'){
        var data = Array();
        var text;
        post = $.parseJSON($('#data').val());
        $('#text').val('');
        if(post['route'] != ''){
            data['route'] = post['route'];
        }else{
            data['route'] = '';
        }
        
        if(post['notes'] != ''){
            data['notes'] = post['notes'];
        }else{
            data['notes'] = '';
        }
        if(typeof(post['churchData']) != 'undefined'){
            data['churchData'] = 'SI';
        }else{
            data['churchData'] = 'NO';
        }
        if(typeof(post['license']) != 'undefined'){
            data['license'] = 'SI';
        }else{
            data['license'] = 'NO';
        }
        if(typeof(post['receive']) != 'undefined'){
            data['receive'] = 'SI';
        }else{
            data['receive'] = 'NO';
        }      
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {service : service, data : Object.values(data), doc : docName },
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
            }
        });
        $('#text').val(text);
    }

    if(docName == 'tarjetonAgradecimiento'){
        var data = Array();
        var text;
        post = $.parseJSON($('#data').val());
        if(post['text'] != ''){
            data['text'] = post['text']
        }
        $('#text').val('');
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {service : service, data : Object.values(data), doc : docName },
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
            }
        });
        $('#text').val(text);
    }

    if(docName == 'libroVisitas'){
        $('#radios').prop('class', 'show');
        radio = 'general';
    }

    if(docName == 'esquela'){
        $('#radiosEsquela').prop('class', 'show');
        radio = 'cruceiro';
        $('#imgDoc').append('<img src="' + uri + 'core/libraries/pdfs/images/esq_cruceiro.jpg" height="100" width="65" class="img-thumbnail">');
        $('#renewObituary').removeClass('hide');
    }

    if(docName == 'situacionNichoJudicial'){
        $('#uploadNicheImage').parent().removeClass('hide');
    }

    if(docName == 'autoCremacion'){
        post = $.parseJSON($('#data').val());
        $('#text').val('');
        var data = Array();
        switch (post['checkAutoCremacion']) {
            case 'cadaver':
                data['cadaver'] = 'SI';
                data['remains'] = 'NO';
                data['ashes'] = 'NO';
                break;
            case 'remains':
                data['cadaver'] = 'NO';
                data['remains'] = 'SI';
                data['ashes'] = 'NO';
                break;
            case 'ashes':
                data['cadaver'] = 'NO';
                data['remains'] = 'NO';
                data['ashes'] = 'SI';
                break;
        }
        if(typeof(post['pacemaker']) != 'undefined'){
            data['pacemaker'] = 'SI';
        }else{
            data['pacemaker'] = 'NO';
        }
        if(post['pacemakerText'] != ''){
            data['pacemakerText'] = post['pacemakerText'];
        }else{
            data['pacemakerText'] = '';
        }
        var text;
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {service : service, data : Object.values(data), doc : docName },
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
            }
        });
        $('#text').val(text);

    }

    if(docName == 'actaPreparacion'){
        post = $.parseJSON($('#data').val());
        $('#text').val('');
        var data = Array();
        data['accesories'] = post['accesories'];
        data['belongings'] = post['belongings'];
        data['cadaverDress'] = post['cadaverDress'];
        data['cleaning'] = post['cleaning'];
        data['cosmetic'] = post['cosmetic'];
        data['deliverClothing'] = post['deliverClothing'];
        data['eyesMouth'] = post['eyesMouth'];
        data['hairpieces'] = post['hairpieces'];
        data['holes'] = post['holes'];
        data['reconstructive'] = post['reconstructive'];
        if(typeof(post['revisedClothing']) == "undefined"){
            post['revisedClothing'] = "NO";
        }
        data['revisedClothing'] = post['revisedClothing'];
        data['shavedOff'] = post['shavedOff'];
        data['positionRadio'] = post['positionRadio'];
        data['hairstyleTextRadio'] = post['hairstyleTextRadio'];
        data['insideTextRadio'] = post['insideTextRadio'];
        data['cleaningTextRadio'] = post['cleaningTextRadio'];
        data['articlesTextRadio'] = post['articlesTextRadio'];
        data['stateTextRadio'] = post['stateTextRadio'];
        data['articlesText'] = post['articlesText'];
        data['belongingsText'] = post['belongingsText'];
        data['hairstyleText'] = post['hairstyleText'];
        data['insideText'] = post['insideText'];
        data['positionText'] = post['positionText'];
        data['stateText'] = post['stateText'];
        data['cleaningText'] = post['cleaningText'];
        data['accesoriesText'] = post['accesoriesText'];
        data['reconstructiveText'] = post['reconstructiveText'];
        data['stateText'] = post['stateText'];
        data['familyText'] = post['familyText'];
        data['clientText'] = post['clientText'];
        data['pickPerson'] = post['pickPerson'];
        data['otherPickPerson'] = post['otherPickPerson'];
        data['deceasedIdentify'] = post['deceasedIdentify'];
        data['deceasedIdentifyText'] = post['deceasedIdentifyText'];
        
        var text;
        //data);
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {service : service, data : Object.values(data), doc : docName },
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
            }
        });
        $('#text').val(text);
    }

    $('#radios').on('change', function() {
        radio = $('input[name=img]:checked', '#radios').val()
        var text;
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {service : service, doc : docName, data: radio},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
            }
        });
        CKEDITOR.instances.text.setData(text); 
        $('#text').val(text);
    });

    if(docName == 'esquela'){
        // Tipos de esquela
        $.ajax({
            url: uri + 'core/obituaries/functions.php',
            method: 'POST',
            data: {
                type: 'getTypes'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
    
                if(data != null){
                    $.each(data, function(index, elem){
                        $('#type').append('<option value="' + elem.ID + '">' + elem.name + '</option>')
                    })
                }
    
                var hasDeceasedImage
    
                $.ajax({
                    url: uri + 'core/obituaries/functions.php',
                    method: 'POST',
                    data: {
                        type: 'hasDeceasedImage',
                        id: $('#type').val()
                    },
                    async: false,
                    success: function(data){
                        try{
                            hasDeceasedImage = $.parseJSON(data)
                        }catch(e){
                            hasDeceasedImage = false;
                        }
                    }
                })
    
                if(hasDeceasedImage){
                    $('#deceasedSection').removeClass('hide')
                }else{
                    $('#deceasedSection').addClass('hide')
                }
    
                loadTemplate(1)
            }
        })
    
        $('#type').change(function(){
            var type = $(this).val()
            var hasDeceasedImage
    
            $.ajax({
                url: uri + 'core/obituaries/functions.php',
                method: 'POST',
                data: {
                    type: 'hasDeceasedImage',
                    id: type
                },
                async: false,
                success: function(data){
                    try{
                        hasDeceasedImage = $.parseJSON(data)
                    }catch(e){
                        hasDeceasedImage = false;
                    }
    
                    loadTemplate2(type)
                }
            })
    
            if(hasDeceasedImage){
                $('#deceasedSection').removeClass('hide')
            }else{
                $('#deceasedSection').addClass('hide')
            }
        })
    
        $('#uploadDeceasedImage').click(function(){
            var file = $('#deceasedImage')[0].files[0] == undefined ? null : $('#deceasedImage')[0].files[0]
    
            var formData = new FormData()
            formData.append('type', 'uploadDeceasedImage')
            formData.append('expedient', service)
            formData.append('file', file)
    
            $.ajax({
                url: uri + 'core/obituaries/functions.php',
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Imagen subida con éxito.</div>')
                        
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
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            loadTemplate2($('#type').val())
        })
    
        function loadTemplate(template){
            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    service : service,
                    doc : 'esquela',
                    template: template
                },
                type: 'POST',
                async: false,            
                success: function (data) {
                    text = data;
                }
            });
            //CKEDITOR.instances.text.setData(text)
            $('#text').val('').trigger('change')
            $('#text').val(text).trigger('change');
        }
    
        function loadTemplate2(template){
            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    service : service,
                    doc : 'esquela',
                    template: template
                },
                type: 'POST',
                async: false,            
                success: function (data) {
                    text = data;
                }
            });
            CKEDITOR.instances.text.setData(text)
            $('#text').val('').trigger('change')
            $('#text').val(text).trigger('change');
        }
    }

    $('#uploadNiche').click(function(){
        var inputFile = document.getElementById('uploadNicheImage');
        var files = inputFile.files;
        for(var i = 0; i < files.length; i++){
            var docName = files[i].name;
            var data = new FormData();
            data.append('archivo', files[i]);
            data.append('expedientID', service);
            $.ajax({
                url: uri + "core/niches/uploadNicheImage.php",
                type: 'POST',
                contentType: false,
                data: data,
                async: false,  
                processData: false,
                cache: false
            });
        }
                
        var text;
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {service : service, doc : 'situacionNichoJudicial', img: radio, renew: false},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
            }
        });
        CKEDITOR.instances.text.setData(text);
        $('#text').val(text);
    });
    
    $('#export').click(function(){
        var text;
        $('textarea.ckeditor').each(function () {
            text = $(this);
            text.val(CKEDITOR.instances[text.attr('name')].getData());
        });
        var docName = $('#docName').val();
        text = $('#text').val();        
        text = text.replaceAll(ROOT, '/var/www/html/')

        var service = $('#service').val();

        if(docName == 'incVigoMemorial' || docName == 'incTanatorioBoisaca'){
            docName = 'autoIncineracion';
        }

        switch(docName){
            case 'justificanteSepelio':
                var count

                $.ajax({
                    url: uri + "core/expedients/docs/functions.php",
                    data: {
                        service : service,
                        type : 'countPdfs',
                        docName : docName
                    },
                    type: 'POST',
                    async: false,
                    success: function (data) {
                        count = $.parseJSON(data);
                    }
                });

                doc = docName + '_' + count;

                processPDF(docName, text, service, radio, doc);
                
                $.ajax({
                    url: uri + "core/expedients/docs/create.php",
                    data: {
                        expedientID : service, 
                        userID : getUserID(), 
                        nameFile : 'Justificante de asistencia al sepelio',
                        doc : doc,
                        file : uri + 'resources/files/' + company + '/expedients/'+ service + '/docs/' + doc + '.pdf',
                        opt : 'upload',
                        type : 21
                    },
                    type: 'POST',
                    async: false
                });

                setTimeout(function(){
                    window.open(uri + 'descargar-archivo?file=expedients/'+ service + '/docs/' + doc +'.pdf', '_blank')
                    localStorage.setItem("CreatedPDF", doc);
                    window.history.back()     
                }, 1500);
            break

            default:
                switch(docName){
                    case 'actaPreparacion':
                        $.ajax({
                            url : uri + 'core/expedients/docs/functions.php',
                            method : 'POST',
                            data : {
                                type : 'setServiceValue',
                                service : service,
                                model : 804,
                                action : 32,
                            }
                        })

                        $.ajax({
                            url : uri + 'core/expedients/docs/functions.php',
                            method : 'POST',
                            data : {
                                type : 'savePDF',
                                text : text,
                                expedient : service,
                                docName : docName
                            }
                        })
                    break

                    case 'lapidaProvisional':
                        var post = $.parseJSON($('#data').val()).option;
                        
                        if(post == '0'){
                            radio = 'general'
                        }else if(post == '1'){
                            radio = 'señores'
                        }else if(post == '2'){
                            radio = 'señoras'
                        }

                        $.ajax({
                            url : uri + 'core/expedients/docs/functions.php',
                            method : 'POST',
                            data : {
                                type : 'setServiceValue',
                                service : service,
                                model : 568,
                                action : 31,
                            }
                        })
                        $.ajax({
                            url : uri + 'core/expedients/docs/functions.php',
                            method : 'POST',
                            data : {
                                type : 'setServiceValue',
                                service : service,
                                model : 569,
                                action : 31,
                            }
                        })
                    break

                    // Guarda el contenido del CKEditor como html para cargarlo posteriormente al abrir el archivo para editarlo
                    case 'actaIncineracion':
                    case 'autoCremacion':
                    case 'autoPubliEsquela':
                    case 'actaJuzgado':
                    case 'cartaFlores':
                    case 'cartaFloresRegistro':
                    case 'cerradoDefuncion':
                    case 'conservEmbalsamiento':
                    case 'conservTemporal':
                    case 'cremationOrder':
                    case 'cuestionarioSatisfaccion':
                    case 'datosIglesia':                   
                    case 'exhumacionJudicial':
                    case 'situacionNichoJudicial':
                    case 'libroVisitas':
                    case 'noDuelo':
                    case 'pesameWeb':
                    case 'precintadoFeretro':
                    case 'recibis':
                    case 'recordatorio':
                    case 'recordatorioSobre':
                    case 'recordatorioSobreCruz':
                    case 'depositarCenizas':
                    case 'retirarCenizas':
                    case 'trasladoCenizasCadaver':
                    case 'solicitudLiterales':
                    case 'solicitudNecropsia':
                    case 'tarjetonAgradecimiento':
                    case 'tarjetas':
                    case 'trasladoHospital':
                    case 'solicitudModificacion':
                    case 'fichaAsistencia':
                    case 'prestacionServicio':
                    case 'autorizacionPreventiva':
                    case 'reciboOcaso':
                    case 'autoPrestacionServicio':
                    case 'hojaDatosServicio':
                    case 'formularioPedido':
                    case 'hojaPedidos':
                    case 'autoSepultura':
                    case 'actaExtraccionDispositivos':
                    case 'recibisCampaneroLaFE':
                    case 'reconocPrevioIncineracion':
                    case 'autoCremacionTanatorioMSanchez':
                    case 'hojaCementerioCiudadReal':
                    case 'instanciaSanJose':
                    case 'instanciaSEulalia':
                    case 'instanciaInhumacionIbiza':
                    case 'recepcionCadaveresOtrasFunerarias':
                    case 'conservacionAutorizacionFamiliar':
                    case 'mandatoExpreso': //begin
                    case 'modeloHojaDeDatos':
                    case 'modificacionServicioFunerario':
                    case 'parteDefuncion':
                        $.ajax({
                            url : uri + 'core/expedients/docs/functions.php',
                            method : 'POST',
                            data : {
                                type : 'savePDF',
                                text : text,
                                expedient : service,
                                docName : docName
                            }
                        })
                    
                    break
                    case 'esquela':
                        var radio = $('input[name=img]:checked', '#radiosEsquela').val()
                        $.ajax({
                            url : uri + 'core/expedients/docs/functions.php',
                            method : 'POST',
                            data : {
                                type : 'savePDF',
                                text : text,
                                expedient : service,
                                docName : radio
                            }
                        })
                    break
                }
                
                processPDF(docName, text, service, radio);
            
                $.ajax({
                    url: uri + "core/expedients/docs/create.php",
                    data: {expedientID: service, userID: getUserID(), nameFile: docName, file: uri + 'resources/files/' + company + '/expedients/'+ service + '/docs/' + docName +'.pdf' },
                    type: 'POST',
                    async: false
                });

                if(docName == 'actaPreparacion'){
                    window.open(uri + 'descargar-archivo?file=expedients/'+ service + '/docs/' + docName +'.pdf', '_blank')
                    window.history.back()
                }else if(docName == 'cartaFlores' || docName == 'exhumacionJudicial' || docName == 'precintadoFeretro' || docName == 'tarjetonAgradecimiento' || docName == 'trasladoHospital'){
                    window.open(uri + 'descargar-archivo?file=expedients/'+ service + '/docs/' + docName +'.pdf', '_blank')
                    window.history.back()
                }else{
                    setTimeout(function(){
                        window.open(uri + 'descargar-archivo?file=expedients/'+ service + '/docs/' + docName +'.pdf', '_blank')
                        localStorage.setItem("CreatedPDF", docName);
                        window.history.back()    
                    }, 1500);
                }
            break;
        }        
    })
})