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
$(function () {
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('#backLink').click(function(event) {
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
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    changeSpaceFooter()

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Obtenemos los tanatorios y los visualizamos en el grid del panel de información
    $.ajax({
        url: uri+"core/mortuaries/functions.php",
        data: {type: 'getOwnMortuaries'},
        type: 'POST',
        async: false,
        success: function (data) {
            var data = $.parseJSON(data);
            if(data!=null){
                data.forEach(function(element) {
                    //Conformamos la estructura de nuestro grid de tanatorios con su id y nombre
                    $('#mortuaries-grid').append('<li class="col-xs-2">' +
                                                 '<a href="' + uri + 'configuracion/panel-informativo/' + element.mortuaryID +'"><i class="fa fa-tanatory" aria-hidden="true"></i> <span>' + element.name + '</span></a>');
                });
            }else{
                $('#mortuaries-grid').append('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>No existen tanatorios propios para los que gestionar sus paneles informativos.</div>');
            }
        }
    });

   
});    


