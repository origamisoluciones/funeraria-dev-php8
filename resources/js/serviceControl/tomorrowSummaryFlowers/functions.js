moment.locale('es');

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

    $.ajax({
        url: uri + "core/serviceControl/tomorrowSumaryFlowers/list.php",
        method: 'POST',
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            if(data.expedients == null){
                $('#tomorrowSummaryFlowers').empty().append(   
                    '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                    '           No hay servicios disponibles para mañana' +
                    '       </div>'
                )
            }else{

                var productsList = '';
                $.each(data.expedients, function(indexExp, elem){

                    if(indexExp % 2 == 0){
                        var trStyle="background-color: #E4E4E4 !important;"
                    }else{
                        var trStyle="background-color: rgba(0, 0, 0, .05) !important;"
                    }
                    
                    productsList += 
                        '<tr style="'+trStyle+'">'+
                        '    <td colspan="4">'+
                        '        <strong>'+elem.deceasedName + ' ' + elem.deceasedSurname +'</strong>'+
                        '    </td>'+
                        '</tr>'
                    ;
                    $.each(elem.products, function(indexPr, itPr){

                        var deliveryDate = '-';
                        if(itPr.deliveryDate != null && itPr.deliveryDate != ''){
                            deliveryDate = moment(itPr.deliveryDate, "X").format("dddd DD MMMM YYYY")

                            deliveryDate = deliveryDate.split(' ')
                            deliveryDate[0] = deliveryDate[0].charAt(0).toUpperCase() + deliveryDate[0].slice(1)
                            deliveryDate[2] = deliveryDate[2].charAt(0).toUpperCase() + deliveryDate[2].slice(1)
                            deliveryDate = '' + deliveryDate[0] + ' ' + deliveryDate[1] + ' de ' + deliveryDate[2]
                        }

                        productsList += 
                            '<tr style="'+trStyle+'">'+
                            '    <td>'+itPr.product_name + ' ' + itPr.model_name +'</td>'+
                            '    <td>'+itPr.texts+'</td>'+
                            '    <td>'+itPr.supplier_name+'</td>'+
                            '    <td>'+deliveryDate+'</td>'+
                            '</tr>'
                        ;
                    })
                })

                $('#tomorrowSummaryFlowers tbody').empty().append(productsList);
            }
        }
    })

    $('#genPDF').click(function(){
        generateWorkOrderDoc();
    })
})

/**
 * Goes to generate work order document
 * 
 * @param {array} data Data
 */
function generateWorkOrderDoc(){

    $.ajax({
        url: uri + 'core/serviceControl/todaySumaryFlowers/generateDoc.php',
        method: 'POST',
        data: {
            type: 2,
            day: moment().add(1, 'day').format('YYYY-MM-DD')
        },
        async: false,
        success: function(data){
            try{
                filename = $.parseJSON(data)

                window.open(uri + 'descargar-archivo?file=tmp/' + filename, '_blank')
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
}