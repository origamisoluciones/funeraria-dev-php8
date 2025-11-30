/**
 * Obtiene los datos de los documentos
 * 
 * @return {array} info Datos
 */
function getDocumentsInfo(){
    var info = null

    $.ajax({
        url: uri + 'core/documentsInfo/read.php',
        method: 'POST',
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="save" name="save" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
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
    changeSpaceFooter()

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    var info = getDocumentsInfo()
    if(info != null){
        $.each(info, function(index, elem){
            $('#' + elem.name).val(elem.value)
        })
    }

    $('#save').click(function(){
        var responsibleDoc1 = $('#responsibleDoc1').val()
        var nifDoc1 = $('#nifDoc1').val()
        var postDoc1 = $('#postDoc1').val()
        var juzgadoInstruccionDoc19 = $('#juzgadoInstruccionDoc19').val()
        var direccionDoc19 = $('#direccionDoc19').val()
        var localidadDoc19 = $('#localidadDoc19').val()
        var companyDoc1 = $('#companyDoc1').val()
        var companyDoc2 = $('#companyDoc2').val()
        var addressDoc2 = $('#addressDoc2').val()
        var locationDoc2 = $('#locationDoc2').val()
        var provinceDoc2 = $('#provinceDoc2').val()
        var rgpdDoc2 = $('#rgpdDoc2').val()
        var companyDoc3 = $('#companyDoc3').val()
        var addressDoc3 = $('#addressDoc3').val()
        var locationDoc3 = $('#locationDoc3').val()
        var provinceDoc3 = $('#provinceDoc3').val()
        var rgpdNameDoc3 = $('#rgpdNameDoc3').val()
        var rgpdDoc3 = $('#rgpdDoc3').val()
        var staff4 = $('#staff4').val()
        var location4 = $('#location4').val()
        var companyDoc5 = $('#companyDoc5').val()
        var companyDoc6 = $('#companyDoc6').val()
        var addressDoc6 = $('#addressDoc6').val()
        var nameDoc6 = $('#nameDoc6').val()
        var dniDoc6 = $('#dniDoc6').val()
        var locationDoc6 = $('#locationDoc6').val()
        var provinceDoc6 = $('#provinceDoc6').val()
        var locationSignDoc6 = $('#locationSignDoc6').val()
        var insuranceCompanyDoc7 = $('#insuranceCompanyDoc7').val()
        var companyDoc7 = $('#companyDoc7').val()
        var companyDoc8 = $('#companyDoc8').val()
        var rgpdDoc8 = $('#rgpdDoc8').val()
        var locationDoc9 = $('#locationDoc9').val()
        var companyDoc10 = $('#companyDoc10').val()
        var addressDoc10 = $('#addressDoc10').val()
        var locationDoc10 = $('#locationDoc10').val()
        var locationDoc11 = $('#locationDoc11').val()
        var companyDoc12 = $('#companyDoc12').val()
        var companyDoc13 = $('#companyDoc13').val()
        var churchDoc14 = $('#churchDoc14').val()
        var dioceseDoc14 = $('#dioceseDoc14').val()
        var dioceseCifDoc14 = $('#dioceseCifDoc14').val()
        var companyDoc14 = $('#companyDoc14').val()
        var companyCifDoc14 = $('#companyCifDoc14').val()
        var companyAddressDoc14 = $('#companyAddressDoc14').val()
        var locationDoc14 = $('#locationDoc14').val()
        var companyDoc15 = $('#companyDoc15').val()
        var companyDoc16 = $('#companyDoc16').val()
        var companyCifDoc16 = $('#companyCifDoc16').val()
        var companyPhoneDoc16 = $('#companyPhoneDoc16').val()
        var companyAddressDoc16 = $('#companyAddressDoc16').val()
        var companyLocationDoc16 = $('#companyLocationDoc16').val()
        var companyPostalCodeDoc16 = $('#companyPostalCodeDoc16').val()
        var companyProvinceDoc16 = $('#companyProvinceDoc16').val()
        var locationDoc16 = $('#locationDoc16').val()
        var locationDoc17 = $('#locationDoc17').val()
        var companyDoc18 = $('#companyDoc18').val()
        var companyCifDoc18 = $('#companyCifDoc18').val()
        var companyAddressDoc18 = $('#companyAddressDoc18').val()
        var companyLocationDoc18 = $('#companyLocationDoc18').val()
        var companyDoc20 = $('#companyDoc20').val()
        var companyCifDoc20 = $('#companyCifDoc20').val()
        var companyAddressDoc20 = $('#companyAddressDoc20').val()
        var companyLocationDoc20 = $('#companyLocationDoc20').val()
        var companyDoc21 = $('#companyDoc21').val()
        var companyLocationDoc21 = $('#companyLocationDoc21').val()
        var companyLocationDoc22 = $('#companyLocationDoc22').val()
        var companyLocationDoc23 = $('#companyLocationDoc23').val()
        var companyLocationDoc24 = $('#companyLocationDoc24').val()
        var emailDoc25 = $('#emailDoc25').val()
        var companyDoc26 = $('#companyDoc26').val()
        var companyAddressDoc26 = $('#companyAddressDoc26').val()
        var companyLocationDoc26 = $('#companyLocationDoc26').val()
        var companyProvinceDoc26 = $('#companyProvinceDoc26').val()
        var companyDoc27 = $('#companyDoc27').val()
        var companyAddressDoc27 = $('#companyAddressDoc27').val()
        var companyLocationDoc27 = $('#companyLocationDoc27').val()
        var companyProvinceDoc27 = $('#companyProvinceDoc27').val()
        var companyDoc28 = $('#companyDoc28').val()
        var companyAddressDoc28 = $('#companyAddressDoc28').val()
        var companyLocationDoc28 = $('#companyLocationDoc28').val()
        var companyProvinceDoc28 = $('#companyProvinceDoc28').val()

        var data = {
            0: {name: 'responsibleDoc1', value: responsibleDoc1},
            1: {name: 'nifDoc1', value: nifDoc1},
            2: {name: 'postDoc1', value: postDoc1},
            3: {name: 'companyDoc1', value: companyDoc1},
            4: {name: 'companyDoc2', value: companyDoc2},
            5: {name: 'addressDoc2', value: addressDoc2},
            6: {name: 'locationDoc2', value: locationDoc2},
            7: {name: 'provinceDoc2', value: provinceDoc2},
            8: {name: 'rgpdDoc2', value: rgpdDoc2},
            9: {name: 'companyDoc3', value: companyDoc3},
            10: {name: 'addressDoc3', value: addressDoc3},
            11: {name: 'locationDoc3', value: locationDoc3},
            12: {name: 'provinceDoc3', value: provinceDoc3},
            13: {name: 'rgpdNameDoc3', value: rgpdNameDoc3},
            14: {name: 'rgpdDoc3', value: rgpdDoc3},
            15: {name: 'staff4', value: staff4},
            16: {name: 'location4', value: location4},
            17: {name: 'companyDoc5', value: companyDoc5},
            18: {name: 'companyDoc6', value: companyDoc6},
            19: {name: 'addressDoc6', value: addressDoc6},
            20: {name: 'locationDoc6', value: locationDoc6},
            21: {name: 'provinceDoc6', value: provinceDoc6},
            22: {name: 'locationSignDoc6', value: locationSignDoc6},
            23: {name: 'insuranceCompanyDoc7', value: insuranceCompanyDoc7},
            24: {name: 'companyDoc7', value: companyDoc7},
            25: {name: 'companyDoc8', value: companyDoc8},
            26: {name: 'rgpdDoc8', value: rgpdDoc8},
            27: {name: 'locationDoc9', value: locationDoc9},
            28: {name: 'companyDoc10', value: companyDoc10},
            29: {name: 'addressDoc10', value: addressDoc10},
            30: {name: 'locationDoc10', value: locationDoc10},
            31: {name: 'locationDoc11', value: locationDoc11},
            32: {name: 'companyDoc12', value: companyDoc12},
            33: {name: 'companyDoc13', value: companyDoc13},
            34: {name: 'churchDoc14', value: churchDoc14},
            35: {name: 'dioceseDoc14', value: dioceseDoc14},
            36: {name: 'dioceseCifDoc14', value: dioceseCifDoc14},
            37: {name: 'companyDoc14', value: companyDoc14},
            38: {name: 'companyCifDoc14', value: companyCifDoc14},
            39: {name: 'companyAddressDoc14', value: companyAddressDoc14},
            40: {name: 'locationDoc14', value: locationDoc14},
            41: {name: 'companyDoc15', value: companyDoc15},
            42: {name: 'companyDoc16', value: companyDoc16},
            43: {name: 'companyCifDoc16', value: companyCifDoc16},
            44: {name: 'companyPhoneDoc16', value: companyPhoneDoc16},
            45: {name: 'companyAddressDoc16', value: companyAddressDoc16},
            46: {name: 'companyLocationDoc16', value: companyLocationDoc16},
            47: {name: 'companyPostalCodeDoc16', value: companyPostalCodeDoc16},
            48: {name: 'companyProvinceDoc16', value: companyProvinceDoc16},
            49: {name: 'locationDoc16', value: locationDoc16},
            50: {name: 'locationDoc17', value: locationDoc17},
            51: {name: 'companyDoc18', value: companyDoc18},
            52: {name: 'companyCifDoc18', value: companyCifDoc18},
            53: {name: 'companyAddressDoc18', value: companyAddressDoc18},
            54: {name: 'companyLocationDoc18', value: companyLocationDoc18},
            55: {name: 'nameDoc6', value: nameDoc6},
            56: {name: 'dniDoc6', value: dniDoc6},
            57: {name: 'juzgadoInstruccionDoc19', value: juzgadoInstruccionDoc19},
            58: {name: 'direccionDoc19', value: direccionDoc19},
            59: {name: 'localidadDoc19', value: localidadDoc19},
            60: {name: 'companyDoc20', value: companyDoc20},
            61: {name: 'companyCifDoc20', value: companyCifDoc20},
            62: {name: 'companyAddressDoc20', value: companyAddressDoc20},
            63: {name: 'companyLocationDoc20', value: companyLocationDoc20},
            64: {name: 'companyDoc21', value: companyDoc21},
            65: {name: 'companyLocationDoc21', value: companyLocationDoc21},
            66: {name: 'companyLocationDoc22', value: companyLocationDoc22},
            67: {name: 'companyLocationDoc23', value: companyLocationDoc23},
            68: {name: 'companyLocationDoc24', value: companyLocationDoc24},
            69: {name: 'emailDoc25', value: emailDoc25},
            70: {name: 'companyDoc26', value: companyDoc26},
            71: {name: 'companyAddressDoc26', value: companyAddressDoc26},
            72: {name: 'companyLocationDoc26', value: companyLocationDoc26},
            73: {name: 'companyProvinceDoc26', value: companyProvinceDoc26},
            74: {name: 'companyDoc27', value: companyDoc27},
            75: {name: 'companyAddressDoc27', value: companyAddressDoc27},
            76: {name: 'companyLocationDoc27', value: companyLocationDoc27},
            77: {name: 'companyProvinceDoc27', value: companyProvinceDoc27},
            78: {name: 'companyDoc28', value: companyDoc28},
            79: {name: 'companyAddressDoc28', value: companyAddressDoc28},
            80: {name: 'companyLocationDoc28', value: companyLocationDoc28},
            81: {name: 'companyProvinceDoc28', value: companyProvinceDoc28}
        }

        $.ajax({
            url: uri + 'core/documentsInfo/update.php',
            method: 'POST',
            data: data,
            dataType: 'json',
            async: false,
            success: function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos se han modificado con éxito.</div>')
        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }else{
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
    })
})