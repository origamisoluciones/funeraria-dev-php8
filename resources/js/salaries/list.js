function getMonthSalaries(year) {
    var monthSalaries;
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'getMonthSalaries', year: year},
        type: 'POST',
        async: false,
        success: function (data) {
            monthSalaries = $.parseJSON(data);
        }
    });
    return monthSalaries;
}


function getSalariesYears() {
    var years;
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'getSalariesYears'},
        type: 'POST',
        async: false,
        success: function (data) {
            years = $.parseJSON(data);
        }
    });
    return years;
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
    moment.locale('es');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('#backLink').click(function(event){
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

    var yearsSalaries = getSalariesYears();
    if(yearsSalaries == null){
        yearsSalaries = new Array
        yearsSalaries['date'] = moment().format('YYYY')
    }
    $('#yearsSalaries').empty().select2()

    $.each(yearsSalaries, function(index){
        $('#yearsSalaries').append('<option value="' + moment(this.date, 'YYYY').format('X') + '">' + this.date + '</option>');
    });
    $('#salariesMonth').append(
        "<thead><tr>"
        + "     <th class='hide'>date</th>"
        + "     <th class='centered'>Fecha</th>"
        + "     <th class='centered'>Bruto</th>"
        + "     <th class='centered'>Líquido</th>"
        + "     <th class='centered'>Ret. Espec</th>"
        + "     <th class='centered'>IRPF</th>"
        + "     <th class='centered'>SSTRAB</th>"
        + "     <th class='centered'>SSEMP</th>"
        + "     <th class='centered'>Total TC1</th>"
        + "     <th class='centered'>Coste empresa</th>"
        + "     <th class='centered'>Embargo</th>"
        + "     <th class='centered'>Dietas mes</th>"
        + "     <th class='centered'>Plus disponibilidad</th>"
        + "     <th class='centered'>Provisión pagas extras</th>"
        + "     <th class='centered'>Editar</th>"
        + "</tr></thead><tbody></tbody>");

    $('#yearsSalaries').change(function(){
        $('#salariesMonth tbody').empty();
        var year = moment($(this).val(), 'X').format('YYYY');
        var monthSalaries = getMonthSalaries(year);

        $.each(monthSalaries, function(){
            var month = moment(this.date, 'X').format('MMMM');
            month = month.charAt(0).toUpperCase() + month.slice(1);
            var year = moment(this.date, 'X').format('YYYY');
    
            $('#salariesMonth tbody').append(
                "<tr>"
                + "<td class='hide'>" + this.date + "</td>"
                + "<td class='centered'>" + month + " de " + year + "</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.gross).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.liquid).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.retribution).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.IRPF).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.SSTRAB).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.SSEMP).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.totalTC1).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.companyCost).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.seizure).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.diet).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.plus).toFixed(2)) + " €</td>"
                + "<td class='centered'>" + toFormatNumber(parseFloat(this.extra).toFixed(2)) + " €</td>"
                + "<td class='centered'><ul class='actions-menu' style='width:100%'><li><a href='" + uri + "salidas/sueldos-salarios/editar/" + this.date + "' class='btn-view'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul></td>"
                + "</tr>");
        });
    });
    setTimeout(() => {
        $('#yearsSalaries').val(moment('01/01/' + moment().format('YYYY')).format('X')).trigger('change')
    }, 250);

    $('#createSalaries').click(function(){
        $.ajax({
            url: uri + "core/salaries/functions.php",
            method: 'POST',
            data: {
                type: 'createSalariesYear',
                year: moment($('#yearsSalaries').val(), 'X').format('YYYY')
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los salarios se han creado con éxito</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tabla de personal actualizada</div>');

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
        });

        monthSalaries = getMonthSalaries(moment($('#yearsSalaries').val(), 'X').format('YYYY'))

        $('#salariesMonth tbody').empty()
        $.each(monthSalaries, function(){
            var month = moment(this.date, 'X').format('MMMM');
            month = month.charAt(0).toUpperCase() + month.slice(1);
            var year = moment(this.date, 'X').format('YYYY');
    
            $('#salariesMonth tbody').append("<tr>"
                                        + "<td class='hide'>" + this.date + "</td>"
                                        + "<td class='centered'>" + month + " de " + year + "</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.gross).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.liquid).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.retribution).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.IRPF).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.SSTRAB).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.SSEMP).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.totalTC1).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.companyCost).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.seizure).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.diet).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.plus).toFixed(2)) + " €</td>"
                                        + "<td class='centered'>" + toFormatNumber(parseFloat(this.extra).toFixed(2)) + " €</td>"
                                        + "<td class='centered'><ul class='actions-menu' style='width:100%'><li><a href='" + uri + "salidas/sueldos-salarios/editar/" + this.date + "' class='btn-view'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul></td>"
                                        + "</tr>");
        })
    })

    $('#createSalaries').click()
})