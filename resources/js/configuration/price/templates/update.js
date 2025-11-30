const priceID =  window.location.href.split("/")[window.location.href.split("/").length - 1]

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
            type: 'getModelsPrices',
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

    $.post(uri+"core/prices/read.php", {priceID: priceID}, function(data){
        data = $.parseJSON(data);
        $('#tableTitle').append('Tarifa ' + data.name + ' ' + data.year + ' - Listado de productos');
        $(".year-price").text(data.year)
        $(".previous-year-price").text(parseInt(data.year) - 1)
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

    var models = getModels(template)
    if(models == null || models.length == 0){
        $('#models').append('<tr><td colspan="5" class="text-center">No hay modelos para mostrar</td></tr>')
    }else{
        var currentProduct = null
        var tbodyTable = '';
        var backgroundTrColor = '';
        var backgroundTrIndex = 0;
        $.each(models, function(index, elem){

            if(currentProduct != elem.productID){
                var producModals = models.filter(e => e.productID == elem.productID);

                if(backgroundTrIndex % 2 == 0){
                    backgroundTrColor = 'background-color: #E4E4E4 !important;';
                }else{
                    backgroundTrColor = 'background-color: rgba(0, 0, 0, .05)!important;';
                }
                backgroundTrIndex++;

                tbodyTable += 
                    '   <tr class="model" style="'+backgroundTrColor+'">' +
                    '       <td class="modelID hide">' + elem.productModelID + '</td>' +
                    '       <td rowspan="'+producModals.length+'">' + elem.productName + '</td>' +
                    '       <td>' + elem.modelName + '</td>' +
                    '       <td>' + toFormatNumber(parseFloat(elem.last_price).toFixed(2)) + ' €</td>' +
                    '       <td>' + toFormatNumber(parseFloat(elem.current_price).toFixed(2)) + ' €</td>' +
                    '       <td>' +
                    '            <div class="form-group">' +
                    '                <div class="col-xs-12">' +
                    '                    <div class="input-group">' +
                    '                        <input type="number" size="80" min="0" class="form-control new-price" model="'+elem.productModelID+'" id="newPrice-'+elem.productModelID+'" name="newPrice-'+elem.productModelID+'" autocomplete="none">' +
                    '                        <div class="input-group-addon">€</div>' +
                    '                    </div>' +
                    '                    <span class="inputError" id="newPrice-'+elem.productModelID+'Error"></span>' +
                    '                </div>' +
                    '            </div>'+
                    '       </td>' +
                    '   </tr>'

                currentProduct = elem.productID

            }else{
                tbodyTable += 
                    '   <tr class="model" style="'+backgroundTrColor+'">' +
                    '       <td class="modelID hide">' + elem.productModelID + '</td>' +
                    '       <td>' + elem.modelName + '</td>' +
                    '       <td>' + toFormatNumber(parseFloat(elem.last_price).toFixed(2)) + ' €</td>' +
                    '       <td>' + toFormatNumber(parseFloat(elem.current_price).toFixed(2)) + ' €</td>' +
                    '       <td>' +
                    '            <div class="form-group">' +
                    '                <div class="col-xs-12">' +
                    '                    <div class="input-group">' +
                    '                        <input type="number" size="80" min="0" class="form-control new-price" model="'+elem.productModelID+'" id="newPrice-'+elem.productModelID+'" name="newPrice-'+elem.productModelID+'" autocomplete="none">' +
                    '                        <div class="input-group-addon">€</div>' +
                    '                    </div>' +
                    '                    <span class="inputError" id="newPrice-'+elem.productModelID+'Error"></span>' +
                    '                </div>' +
                    '            </div>'+
                    '       </td>' +
                    '   </tr>'
            }
        })

        $('#models').append(tbodyTable);
    }

    $('#saveTemplate').click(function(){
        $('#saveTemplate').attr("disabled", true);
        var save = new Array

        $("#modelsTemplate tbody .new-price").each(function(){
            var model = $(this).attr("model");
            if($(this).val() != ''){
                save.push([model, $(this).val()])
            }
        })

        if(save.length > 0){
            $("#confirmUpdateTemplate").modal("show");
            $('#saveTemplate').attr("disabled", false);
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario añadir al menos una nueva tarifa</div>')
            $('#saveTemplate').attr("disabled", false);
            
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })

    $('#confirmUpdateTemplate #confirm').click(function(){
        $('#confirmUpdateTemplate #confirm').attr("disabled", true);
        var save = new Array

        $("#modelsTemplate tbody .new-price").each(function(){
            var model = $(this).attr("model");
            if($(this).val() != ''){
                save.push([model, $(this).val()])
            }
        })

        if(save.length > 0){
            $.ajax({
                url: uri + 'core/prices/templates/functions.php',
                method: 'POST',
                data: {
                    type: 'saveTemplatePrices',
                    save: save,
                    price: priceID
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data);

                        if(data){
                            $("#confirmUpdateTemplate").modal("hide");
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los precios han sido actualizados con éxito.</div>');

                            setTimeout(function(){
                                window.location.reload();
                            }, 1500)
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            $('#confirmUpdateTemplate #confirm').attr("disabled", true);
                            $("#confirmUpdateTemplate").modal("hide");

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#confirmUpdateTemplate #confirm').attr("disabled", true);
                        $("#confirmUpdateTemplate").modal("hide");

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#confirmUpdateTemplate #confirm').attr("disabled", true);
                    $("#confirmUpdateTemplate").modal("hide");

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario añadir al menos una nueva tarifa</div>')
            $('#confirmUpdateTemplate #confirm').attr("disabled", true);
            $("#confirmUpdateTemplate").modal("hide");
            
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })
})