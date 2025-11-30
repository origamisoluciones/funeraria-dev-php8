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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    var cremations;
    $.ajax({
        url: uri+"core/serviceControl/cremations/functions.php",
        type: 'POST',
        data: {type: 'getTomorrowCremations'},
        async: false,
        success: function (data){
            cremations = $.parseJSON(data);
        }
    });

    if(cremations != null){

        var cremationsOrdered = cremations.sort((a, b) => parseInt(a.crematoriumID) - parseInt(b.crematoriumID));

        var currentCrematorium = null;
        var text = '';
        $.each(cremationsOrdered, function(index, elem){

            var crematoriumName = '-'
            if(elem.crematoriumName != ''){
                crematoriumName = elem.crematoriumName
            }

            if(elem.crematoriumID != currentCrematorium){
                text += "<div class='col-xs-12'>"+
                        "    <legend class='legendBottom' style='border-bottom:0px; text-align:center'>"+
                        "       <span class='label label-primary labelLgExp'>Crematorio "+crematoriumName+"</span>"+
                        "   </legend>" +
                        "</div>"

                currentCrematorium = elem.crematoriumID;
            }
            
            var deceasedName = '-'
            if(elem.deceasedName != ''){
                deceasedName = elem.deceasedName
            }
            var deceasedSurname = '-'
            if(elem.deceasedSurname != ''){
                deceasedSurname = elem.deceasedSurname
            }
            var crematoriumIntroduction = 'No'
            if(elem.crematoriumIntroduction == "1"){
                crematoriumIntroduction = "Si"
            }
            var crematoriumWaitOnRoom = 'No'
            if(elem.crematoriumWaitOnRoom == "1"){
                crematoriumWaitOnRoom = "Si"
            }
            var crematoriumVaseBio = 'No'
            if(elem.crematoriumVaseBio == "1"){
                crematoriumVaseBio = "Si"
            }
            var funeralHome = '-'
            if(elem.funeralHome != null){
                funeralHome = elem.funeralHome
            }
            var crematoriumArriveTime = '-'
            if(elem.crematoriumArriveTime != null && elem.crematoriumArriveTime != "" ){
                crematoriumArriveTime = moment(elem.crematoriumArriveTime,"hh:mm:ss").format("HH:mm")
            }
            if(elem.ecologicCoffin == "0"){
                var ecologicCoffin = "No";
            }else{
                var ecologicCoffin = "Si";
            }
            var authDateTime = '';
            if(elem.authDate != null){
                authDateTime += moment(elem.authDate, 'X').format('DD/MM/YYYY');
            }
            if(elem.authTime != null){
                authDateTime += ' ' + moment(elem.authTime, 'X').format('HH:mm');
            }

            text +=     "<div class='details-sumary col-xs-4'>" +
                        "    <dl class='dl-horizontal' style='background-color: #D1FAFF;!important'>" +
                        "        <dt>Crematorio: </dt><dd><strong>" + crematoriumName + "</strong></dd>" +
                        "        <dt>Hora de introducción: </dt><dd><strong>" + moment(elem.start,"YYYY-MM-DD hh:mm:ss").format("HH:mm") + "</strong></dd>" +
                        "        <dt>Nº expediente: </dt><dd>" + elem.number + "</dd>" +
                        "        <dt>Nombre: </dt><dd>" + deceasedName + " " + deceasedSurname + "</dd>" +
                        "        <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                        "        <dt>Familiar de contacto: </dt><dd>" + elem.familyContactName + " " + elem.familyContactSurname + " - " + elem.familyContactMobilePhone + "</dd>" +
                        "        <dt>Introducción: </dt><dd>" + crematoriumIntroduction + "</dd>";
            if(elem.crematoriumIntroduction == "1"){
                text +=     "    <dt>Hora llegada familia: </dt><dd>" + crematoriumArriveTime + "</dd>";
            }
            text +=     "        <dt>Esperar en sala: </dt><dd>" + crematoriumWaitOnRoom + "</dd>" +
                        "        <dt>Urna biodegradable: </dt><dd>" + crematoriumVaseBio + "</dd>" +
                        "        <dt>Féretro ecológico: </dt><dd>" + ecologicCoffin + "</dd>" +
                        "        <dt>Entrega de cenizas: </dt><dd>" + authDateTime + "</dd>" +
                        "        <dt>Lugar de entrega: </dt><dd>" + elem.authPlace + "</dd>" +
                        "    </dl>" +
                        "</div>";
        })

        $('#tomorrowCremations').append(text);

    }else{
        $('#tomorrowCremations').append(
            '<div class="col-xs-12">'+
            '   <div class="alert alert-warning alert-dismissible fade in" role="alert">'+ 
            '       <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>'+
            '       No hay cremaciones disponibles para mañana' +
            '   </div>'+
            '</div>');
    }

    $('#genPDF').click(function(){
        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'cremacionesMañana', text: text, service: 0, data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'cremacionesMañana', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function(data){
                        window.open(uri + 'descargar-archivo?file=expedients/0/docs/cremacionesMañana.pdf', '_blank')
                    }
                });
            }
        });
    })
})