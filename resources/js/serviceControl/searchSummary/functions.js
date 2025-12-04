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

    //Pickers
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    $("#searchBtn").click(function(){

        var validate = true;
        if($("#date").val() != '' || $("#date").val() != null){
            var date = moment($("#date").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            validate = false;
        } 
       
        if(validate){
          
            $("#titleSummary").text('Resumen del ' +  $("#date").val())
            $("#titleCremations").text('Cremaciones del ' +  $("#date").val())
            
            $.ajax({
                url: uri + "core/serviceControl/searchSummary/list.php",
                method: 'POST',
                data : {
                    date : date,
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    $('#todaySummary').empty();
                    $('#todayCremations').empty();

                    if(data.expedients == null){
                       
                        $('#todaySummary').append(   
                            '   <div class="col-xs-12">' +
                            '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                            '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                            '           No hay servicios disponibles en el día ' + $("#date").val() +
                            '       </div>' +
                            '   </div>');
                    }else{
                        $.each(data.expedients, function(index, elem){
                            var expedient = elem.expedientID

                            var funeralTime = '-'
                            if(elem.funeralTime != null){
                                funeralTime = moment(elem.funeralTime, 'HH:mm:ss').format('HH:mm')
                            }

                            var number = elem.number

                            var preName = '';
                            if(elem.deceasedGender != null && elem.deceasedGender != ''){
                                preName = 'D. ';
                            }else{
                                preName = 'Dña. ';
                            }

                            var deceasedName = '-'
                            if(elem.deceasedName != ''){
                                deceasedName = elem.deceasedName
                            }

                            var deceasedSurname = '-'
                            if(elem.deceasedSurname != ''){
                                deceasedSurname = elem.deceasedSurname
                            }
                            
                            var mortuary = '-'
                            if(elem.mortuary != null && elem.mortuary != ''){
                                if(elem.mortuary == 'Otro'){
                                    mortuary = elem.deceasedMortuaryAddress
                                }else{
                                    mortuary = elem.mortuary
                                }
                            }

                            var deceasedRoom = '-'
                            if(elem.deceasedRoom != null && elem.deceasedRoom != ''){
                                deceasedRoom = elem.deceasedRoom
                            }

                            var cemeteryRow = '';
                            if(parseInt(elem.cremation) == 1){
                                cemeteryRow = "<dt>Crematorio: </dt><dd>";

                                if(elem.crematoriumName != null && elem.crematoriumName != ''){
                                    cemeteryRow += elem.crematoriumName
                                    
                                    if(elem.crematoriumEntry != null && elem.crematoriumEntry != ''){
                                        cemeteryRow += ' ('+ moment(elem.crematoriumEntry, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') + ')';
                                    }
                                }

                                cemeteryRow += "</dd>";
                            }else{
                                cemeteryRow = "<dt>Cementerio: </dt><dd>";
                                
                                if(elem.cemetery != null && elem.cemetery != ''){
                                    cemeteryRow += elem.cemetery

                                    if(elem.funeralTimeBurial != null && elem.funeralTimeBurial != ''){
                                        cemeteryRow += ' ('+ moment(elem.funeralTimeBurial, 'HH:mm:ss').format('HH:mm') + ')';
                                    }
                                }

                                cemeteryRow += "</dd>";
                            }

                            var carriersTime = '-'
                            if(elem.carriersTime != null){
                                carriersTime = moment(elem.carriersTime, 'HH:mm:ss').format('HH:mm')
                            }
                            if(parseInt(index)%parseInt(3) == 0 && index != 0){
                                $('#todaySummary').append("<div class='clearfix'></div>")
                            }

                            var funeralHome = '-'
                            if(elem.funeralHome != null){
                                funeralHome = elem.funeralHome
                            }

                            var church = '-'
                            if(elem.church != null){
                                church = elem.church
                                
                                if(elem.ceremonyTime != null && elem.ceremonyTime != ''){
                                    church += ' ('+ moment(elem.ceremonyTime, 'HH:mm:ss').format('HH:mm') + ')';
                                }
                            }

                            var buses = '-'
                            if(elem.buses != null){
                                buses = elem.buses
                            }

                            var flag = false;
                            if(parseInt(elem.type) == 3){
                                $.each(data.cremations, function(index, elem2){
                                    if(elem2.expedientID == elem.expedientID){
                                        flag = true;
                                    }
                                })
                            }

                            var text =  "   <div class='details-sumary col-xs-4'>" +
                                        "       <dl class='dl-horizontal'>" +
                                        "           <dt>Hora de salida: </dt><dd><strong>" + funeralTime + "</strong></dd>" +
                                        "           <dt>Nº exp: </dt><dd>" + number + "</dd>" +
                                        "           <dt>Nombre: </dt><dd>" + preName + deceasedName + " " + deceasedSurname + "</dd>" +
                                        "           <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                                        "           <dt>Casa mortuoria: </dt><dd>" + mortuary + "</dd>" +
                                        "           <dt>Sala: </dt><dd>" + deceasedRoom + "</dd>" +
                                        "           <dt>Nº Autobuses: </dt><dd>" + buses + "</dd>" +
                                        "           <dt>Parroquia: </dt><dd>" + church + "</dd>" +
                                                    cemeteryRow +
                                        "           <dt>Porteadores: </dt><dd>" + carriersTime + "</dd>" +
                                        "           <ol>";

                            if(elem.carriers.length > 0){                        
                                var brand =''
                                var model = ''
                                var license = ''
                                elem.carriers.forEach(function(carrier){
                                    var flag = true
                                    if(elem.cars.length > 0){                                                              
                                        elem.cars.forEach(function(car){
                                            if(flag){
                                                if((carrier.name + ' ' + carrier.surname) == (car.driverName + ' ' + car.driverSurname)){                                      
                                                    brand = ' - ' + car.brand
                                                    model = car.model
                                                    license = car.licensePlate
                                                    flag = false                                        
                                                }else{
                                                    brand =''
                                                    model = ''
                                                    license = ''                                            
                                                }
                                            }
                                        })
                                    }
                                    if(carrier.confirmed == 1){                                
                                        text +=     "       <li>" + carrier.name + " " + carrier.surname + "<strong>" + brand + " " + model + " " + license + "</strong></li>";      
                                    }else{                                
                                        text +=     "       <li class='c-red'>" + carrier.name + " " + carrier.surname + "<strong>" + brand + "  " + model + " " + license + "</strong></li>";
                                    }
                                })
                            }
                            text +=     "           </ol>";
                            text +=     "       </dl>"
                            "   </div>";

                            if(elem.type == 3 || elem.type == '3'){
                                if(flag){
                                    $('#todaySummary').append(text)
                                }
                            }else{
                                $('#todaySummary').append(text)
                            }
                        })
                    }
                   
                    if(data.cremations == null){
                        $('#todayCremations').append(   
                            '   <div class="col-xs-12">' +
                            '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                            '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                            '           No hay cremaciones disponibles en el día ' + $("#date").val() +
                            '       </div>' +
                            '   </div>');
                    }else{
                        $.each(data.cremations, function(index, elem){
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
                            if(elem.crematoriumPacemaker == "0"){
                                var crematoriumPacemaker = "No";
                            }else{
                                var crematoriumPacemaker = "Si";
                            }
                            if(elem.ecologicCoffin == "0"){
                                var ecologicCoffin = "No";
                            }else{
                                var ecologicCoffin = "Si";
                            }
                            var text =  "   <div class='details-sumary col-xs-4'>" +
                                        "       <dl class='dl-horizontal' style='background-color: #D1FAFF;!important'>" +
                                        "           <dt>Hora de introducción: </dt><dd><strong>" + moment(elem.start,"YYYY-MM-DD hh:mm:ss").format("HH:mm") + "</strong></dd>" +
                                        "           <dt>Nº expediente: </dt><dd>" + elem.number + "</dd>" +
                                        "           <dt>Nombre: </dt><dd>" + deceasedName + " " + deceasedSurname + "</dd>" +
                                        "           <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                                        "           <dt>Familiar de contacto: </dt><dd>" + elem.familyContactName + " " + elem.familyContactSurname + " - " + elem.familyContactMobilePhone + "</dd>" +
                                        "           <dt>Introducción: </dt><dd>" + crematoriumIntroduction + "</dd>";
                            if(elem.crematoriumIntroduction == "1"){
                                text +=     "           <dt>Hora llegada familia: </dt><dd>" + crematoriumArriveTime + "</dd>";
                            }
                            text +=     "           <dt>Esperar en sala: </dt><dd>" + crematoriumWaitOnRoom + "</dd>" +
                                        "           <dt>Urna biodegradable: </dt><dd>" + crematoriumVaseBio + "</dd>" +
                                        "           <dt>Féretro ecológico: </dt><dd>" + ecologicCoffin + "</dd>" +
                                        "           <dt>Portador marcapasos: </dt><dd>" + crematoriumPacemaker + "</dd>" +
                                        "       </dl>" +
                                        "   </div>";
                            $('#todayCremations').append(text);                                                    
                        })
                    }
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario introducir alguna fecha</div>')
            
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    });

    $('#genPDF').click(function(){
        var validate = true;
        var text;
        if($("#date").val() !== ''){
            var dateF = moment($("#date").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var dateS = $("#date").val()
        }else{
            validate = false;
        }
       
        if(validate){
            $.ajax({
                url: uri + 'core/libraries/pdfs/getPdfs.php',
                data: {doc: 'buscarResumen', text: text, service: 0, data:"", dateF: dateF, dateS: dateS},
                type: 'POST',
                async: false,            
                success: function (data) {
                    text = data;
                   
                    $.ajax({
                        url: uri + 'core/libraries/pdfs/process.php',
                        data: {text : text, doc : 'resumenHoy', expedientID: 0},
                        type: 'POST',
                        async: false,            
                        success: function (data) {
                            window.open(uri + 'descargar-archivo?file=expedients/0/docs/resumenHoy.pdf', '_blank')
                        }
                    });
                }
            });
        
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario introducir alguna fecha</div>')
            
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })
})