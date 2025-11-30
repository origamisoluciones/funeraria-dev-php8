/**
 * Obtiene los modelos
 * 
 * @param {int} price Id de la tarifa
 * @return {array} models Modelos
 */
function getModels(price){
    var models

    $.ajax({
        url: uri + 'core/prices/templates/functions.php',
        method: 'POST',
        data: {
            type: 'getModels',
            price : price
        },
        async: false,
        success: function(data){
            try{
                models = $.parseJSON(data)
            }catch(e){
                models = null
            }
        },
        error: function(){
            models = null
        }
    })

    return models
}

function getModelsChecked(price){
    var models

    $.ajax({
        url: uri + 'core/prices/templates/functions.php',
        method: 'POST',
        data: {
            type: 'getModelsChecked',
            price : price
        },
        async: false,
        success: function(data){
            try{
                models = $.parseJSON(data)
            }catch(e){
                models = null
            }
        },
        error: function(){
            models = null
        }
    })

    return models
}

/**
 * Comprueba si la plantilla existe
 * 
 * @param {int} expedient Id de la plantilla (tarifa)
 * @return {bool} check
 */
function existsTemplate(template){
    var check

    $.ajax({
        url: uri + 'core/prices/templates/functions.php',
        method: 'POST',
        data: {
            type: 'existsTemplate',
            price: template
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveTemplate" name="saveTemplate" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
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
        $('#saveTemplate').click();
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

    var priceID =  window.location.href.split("/")[window.location.href.split("/").length - 1]
    $.post(uri+"core/prices/read.php", {priceID: priceID}, function(data){
        data = $.parseJSON(data);
        $('#tableTitle').append('<i class="fa fa fa-paint-brush" aria-hidden="true"></i> Listado tarifas ' + data.name + ' ' + data.year);
    });

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    //Sticky Table Header
    $('#modelsTemplate').stickyTableHeaders();
    $('#modelsTemplate').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    var template = $('#template').val()
    if(existsTemplate(template)){
        $('#existsTemplate').remove()
    }else{
        $('#existsTemplate').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'configuracion/tarifas'
        }, 2500);
        return
    }

    $.post(uri+"core/prices/templates/functions.php", {template: template, type: 'getNotes'}, function(data){
        data = $.parseJSON(data);
        if(data != null){
            $('#notes').val(data)
        }
    });

    var models = getModels(template)
    if(models == null){
        $('#models').append('<tr><td>No hay modelos para mostrar</td></tr>')
    }else{
        var currentProduct = null
        $.each(models, function(index, elem){
            if(currentProduct == elem.productID){
                $('#models').append('   <tr class="model">' +
                                    '       <td class="modelID hide">' + elem.productModelID + '</td>' +
                                    '       <td width="4%" class="checks text-center" >' +
                                    '           <input type="checkbox" class="select-product" id="check' + elem.productModelID + '">' +
                                    '       </td>' +
                                    '       <td width="25%">' + elem.modelName + '</td>' +
                                    '       <td width="10%">' + elem.priceNoIVA + '</td>' +
                                    '   </tr>')
            }else{
                $('#models').append('   <tr>' +
                                    '       <td colspan="4" class="text-center"><strong>' + elem.productName + '</strong></td>' +
                                    '   </tr>')
                
                $('#models').append('   <tr class="model">' +
                                    '       <td class="modelID hide">' + elem.productModelID + '</td>' +
                                    '       <td width="4%" class="checks text-center" >' +
                                    '           <input type="checkbox" class="select-product" id="check' + elem.productModelID + '">' +
                                    '       </td>' +
                                    '       <td width="25%">' + elem.modelName + '</td>' +
                                    '       <td width="10%">' + elem.priceNoIVA + '</td>' +
                                    '   </tr>')
            }

            currentProduct = elem.productID
        })

        var modelsChecks = getModelsChecked(template)
        if(modelsChecks != null){
            $.each(modelsChecks, function(index, elem){
                $("#modelsTemplate tbody tr.model").each(function(){
                    var model = $(this).find('td.modelID').text()
                    if(model == elem.model){
                        $(this).find('td.checks').find('input').prop('checked', true)
                    }
                })
            })
        }
    }

    $('#saveTemplate').click(function(){
        var save = new Array
        $("#modelsTemplate tbody tr.model").each(function(){
            var model = $(this).find('td.modelID').text()
            var check = $(this).find('td.checks').find('input').prop('checked')
            if(check){
                save.push([model, template])
            }
        })
        
        if(save.length == 0){
            save = template
        }

        var notes = $('#notes').val()
        
        $.ajax({
            url: uri + 'core/prices/templates/functions.php',
            method: 'POST',
            data: {
                type: 'saveTemplate',
                save: save,
                notes: notes
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha guardado con éxito.</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
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
    })

    $('#exportCsv').click(function(){

        if($("#models .select-product:checked").length == 0){
            alert("Es necesario seleccionar algún producto");
            return;
        }

        $('#saveTemplate').click();

        $.ajax({
            url: uri + 'core/prices/templates/functions.php',
            method: 'POST',
            data: {
                type: 'exportCsv',
                price: template
            },
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=configuration/pricesTemplates/plantilla.csv', '_blank')
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
    })

    $('#exportPdf').click(function(){
        var text

        if($("#models .select-product:checked").length == 0){
            alert("Es necesario seleccionar algún producto");
            return;
        }

        $('#saveTemplate').click();

        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {
                expedient: template,
                doc: 'plantillaTarifa'
            },
            type: 'POST',
            async: false,
            success: function(data){
                text = data
            }
        })
        $.ajax({
            url: uri + "core/libraries/pdfs/process.php",
            data: {
                doc: 'plantillaTarifa',
                text: text,
                expedientID: '',
                radio: ""
            },
            type: 'POST',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivo?file=configuration/pricesTemplates/plantilla.pdf', '_blank')
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
    })

    $('#checkAll').click(function(){
        $('#models').find('input:checkbox').click()
    })
})