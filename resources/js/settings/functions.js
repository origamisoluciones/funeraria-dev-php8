/**  @var {int} numEmailsCC Store num emails cc */
var numEmailsCC = 1

/**
 * Comprueba si la compañia tiene claves para Via Firma
 */
function getSmsUp() {
    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'getSmsUp'
        },
        type : 'POST',
        async : false,
        success : function(data){
            data = $.parseJSON(data)
            if(data == null || data == false || data.status == 'error'){
                $('#smsSection').remove()
            }else{
                $('#restSms').val(parseInt(data.result.balance))
                $('#smsSection').removeClass('hide')
            }
        }
    })
}

/**
 * Obtiene los datos de los ajustes
 * 
 * @return {array} info Datos
 */
function getData(){
    var info = null

    $.ajax({
        url: uri + 'core/settings/read.php',
        method: 'POST',
        data: {},
        dataType: 'json',
        async: false,
        success: function(data){
            info = data
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
    return info
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

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="save" name="save" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
    changeSpaceFooter()

    $('#cancelLink').click(function(event) {
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

    $('#backLink').click(function(event) {
        $('#save').click();
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
    
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Emails to address cc
    $("#mailToInfo").popover({placement:"top", container: 'body', html: true});
    $("#mailToCCInfo").popover({placement:"top", container: 'body', html: true});

    getSmsUp()

    var data = getData()
    if(data != null){
        var companies = data.companies
        var company = data.company
        var info = data.info
        var hasVerifactuInvoice = data.hasVerifactuInvoice

        if(companies != null){
            $.each(companies, function(index, elem){
                if(elem.supplierID == company){
                    $('#company').append('<option value="' + elem.supplierID + '" selected>' + elem.name + '</option>')
                }else{
                    $('#company').append('<option value="' + elem.supplierID + '">' + elem.name + '</option>')
                }
            })
        }

        if(info != null){
            var times = ''
            $.each(info, function(index, elem){
                switch(elem.name){
                    case 'Curas':
                    case 'Enterradores':
                    case 'Flores':
                    case 'Certificado Médico':
                    case 'Juzgado':
                    case 'Control':
                    case 'Autobús':
                    case 'Taxis':
                    case 'WEB':
                    case 'Policía':
                    case 'Recordatorio':
                    case 'Certificado de preparación':
                    case 'Porteadores':
                        if(index == 0){
                            times += '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">';
                        }
                        if(index % 4 == 0 && index != 0){
                            times += '</div><div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">';
                        }
                        times +=    '   <div class="form-group">' +
                                    '       <label for="' + elem.name + '" class="col-xs-5 control-label">' + elem.name + ' (h.)</label>' +
                                    '       <div class="col-xs-7">' +
                                    '           <input type="text" class="form-control" id="' + elem.name + '" value="' + elem.value + '">' +
                                    '       </div>' +
                                    '   </div>'
                        
                        if(index == info.length - 1){
                            times += '</div>';
                        }
                        break

                    case 'mailPassword':
                    break

                    case 'mailToCC':
                        if(elem.value != ''){
                           var mailsToCC = elem.value.split(";");
                           $.each(mailsToCC, function(indexCC, valueCC){
                                if(indexCC == 0){
                                    $("#emailsSection #mailToCC0").val(valueCC)
                                }else{
                                    addEmailCC(valueCC);
                                }
                           })
                        }
                    break

                    default:
                        $('#' + elem.name).val(elem.value)
                    break
                }
            })
            $('#times').append(times)
        }

        if(COMPANY == 3 || COMPANY == 8){
            $("#verifactu").val(0);
            $("#verifactu").attr("disabled", true);
        }else{
            if(parseInt(hasVerifactuInvoice) > 0){
                $("#verifactu").attr("disabled", true);
            }
        }
    }

    $('#save').click(function(){
        var validate = 0

        var ttl = $('#ttl').val()
        var companyName = $('#companyName').val()
        var companyNIF = $('#companyNIF').val()
        var companyAddress = $('#companyAddress').val()
        var companyPostalCode = $('#companyPostalCode').val()
        var companyLocation = $('#companyLocation').val()
        var technicalServicePhone = $('#technicalServicePhone').val()
        var company = $('#company').val()
        var ivaType = $('#ivaType').val()
        var verifactu = $('#verifactu').val()
        var client = $('#client').val()
        var mailAddress = $('#mailAddress').val()
        var mailPassword = $('#mailPassword').val()
        var host = $('#host').val()
        var port = $('#port').val()
        var times = {}

        if($("#mailTo").val() != ''){
            if(!isEmail($("#mailTo"))){
                validate++
            }
        }
        var mailTo = $("#mailTo").val();
        var mailsToCC = '';
        $.each($("#emailsSection .email-to-cc"), function(index, value){
            if($(this).val() != ''){
                if(!isEmail($("#emailsSection #mailToCC" + index))){
                    validate++
                }
                mailsToCC += $(this).val() + ';';
            }
        })
        if(mailsToCC != ''){
            mailsToCC = mailsToCC.slice(0, -1);
        }

        if(ttl == '' || companyName == '' || companyNIF == '' || companyAddress == '' || companyPostalCode == '' || companyLocation == '' || technicalServicePhone == '' || company == '' || ivaType == '' || verifactu == '' || client == '' || mailAddress == '' || host == '' || port == ''){
            validate++
        }
        
        $('#times input').each(function(index, elem){
            var id = $(this).attr('id')
            var value = $(this).val()

            times['' + id] = value
            if(value == ''){
                validate++
            }
        })

        if(validate == 0){
            var data = {
                ttl: ttl,
                companyName: companyName,
                companyNIF: companyNIF,
                companyAddress: companyAddress,
                companyPostalCode: companyPostalCode,
                companyLocation: companyLocation,
                technicalServicePhone: technicalServicePhone,
                company: company,
                ivaType: ivaType,
                verifactu: verifactu,
                client: client,
                mailAddress: mailAddress,
                mailPassword: mailPassword,
                host: host,
                port: port,
                times: times,
                mailTo: mailTo,
                mailToCC: mailsToCC
            }
            
            // Archivos
            var logo = document.getElementById('logo').files[0]
            var backgroundDocuments = document.getElementById('backgroundDocuments').files[0]
            var backgroundObituaries = document.getElementById('backgroundObituaries').files[0]

            var validateFormatImgs = 0
            $.each(document.getElementById('backgroundDocuments').files, function(index, elem){
                var name = elem.name
                var extension = name.split('.')[name.split('.').length - 1]
                switch(extension.toLowerCase()){
                    case 'jpg':
                        break
                    default:
                        validateFormatImgs++
                }
            })

            if(validateFormatImgs > 0){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Formato de imagen incorrecto (solo se admite jpg)</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                return false
            }

            var validateFormatImgs = 0
            $.each(document.getElementById('backgroundObituaries').files, function(index, elem){
                var name = elem.name
                var extension = name.split('.')[name.split('.').length - 1]
                switch(extension.toLowerCase()){
                    case 'jpg':
                    break
                    default:
                        validateFormatImgs++
                    break;
                }
            })

            if(validateFormatImgs > 0){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Formato de imagen incorrecto (solo se admite jpg)</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                return false
            }

            var formData = new FormData
            formData.append('data', JSON.stringify(data))
            formData.append('logo', logo)
            formData.append('backgroundDocuments', backgroundDocuments)
            formData.append('backgroundObituaries', backgroundObituaries)

            $.ajax({
                url: uri + 'core/settings/update.php',
                method: 'POST',
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                cache: false,
                success: function(data){
                    try{
                        switch(data){
                            case true:
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los ajustes se han actualizado con éxito.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            break
                            case false:
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            break
                            case 'image':
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El formato de imagen no está permitido</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            break
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
            
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir. Son necesarios todos excepto los del bloque de diseño, que son optativos</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
})

/**
 * Adds a email - Traffic Low destinataries
 * 
 * @param {array} data Email
 */
function addEmailCC(data = null){

    $("#emailsSection").append(
        '<div id="mailToCCSection'+numEmailsCC+'" class="col-lg-4 col-md-12 col-sm-12 col-xs-12">'+
        '    <div class="form-group">'+
        '        <label for="mailToCC'+numEmailsCC+'" class="col-xs-3 control-label">Copia (CC)</label>'+
        '        <div class="col-xs-9" style="display:flex;">'+
        '            <input type="email" class="form-control email-to-cc" id="mailToCC'+numEmailsCC+'" size="25">'+
        '            <span style="margin-left: 0.7em;">'+
        '                <button type="button" class="btn btn-danger" onclick="deleteEmailCC('+numEmailsCC+')">'+
        '                    <i class="fa fa-trash" style="padding: 3px;"></i>'+
        '                </button>'+
        '            </span>'+
        '        </div>'+
        '        <span class="inputError" id="mailToCC'+numEmailsCC+'Error" style="margin-left: 90px;"></span>'+
        '    </div>'+
        '</div>'
    );
    
    if(data != null){
        $("#emailsSection #mailToCC"+numEmailsCC).val(data);
    }

    numEmailsCC++;
}

/**
 * Deletes a CC email
 * 
 * @param {int} emailDiv Email container identifier to remove
 */
function deleteEmailCC(emailDiv){
    $("#emailsSection #mailToCCSection"+emailDiv).remove();
}