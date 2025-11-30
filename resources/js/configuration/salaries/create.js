function getAllUsersExcepTemplates() {
    var users;
    $.ajax({
        url: uri + "core/users/functions2.php",
        data: {type: 'getAllUsersExcepTemplates'},
        type: 'POST',
        async: false,
        success: function (data) {
            users = $.parseJSON(data);
        }
    });
    return users;
}

function saveTemplate(salariesUsers, templateName) {
    if(Object.keys(salariesUsers).length > 0){
        $.ajax({
            url: uri + "core/salaries/functions.php",
            data: {type: 'saveTemplate', salariesUsers: salariesUsers, templateName: templateName},
            type: 'POST',
            async: false,
            success: function (data) {
                data = $.parseJSON(data);
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los sueldos han sido actualizados.</div>');
                    setTimeout(() => {
                        $('#block-message').empty();
                        window.location.href = uri + "configuracion/salidas/configuracion"
                    }, 1500);
                }else{
                    $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición no se ha podido realizar en estos momentos.</div>');
                    setTimeout(() => {
                        $('#block-message').empty();
                        window.location.href = uri + "configuracion/salidas/configuracion"
                    }, 1500);
                }
            }
        });
    }else{
        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario seleccionar un usuario para guardar la plantilla</div>');
    }
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveSalaries" name="saveSalaries" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
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
        $('#saveSalaries').click();
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
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    
    var allUsers = getAllUsersExcepTemplates();

    $('#salaries').append("<thead><tr>"
                        + "     <th class='hide'>staff</th>"
                        + "     <th>Selección</th>"
                        + "     <th class='centered'>Nombre</th>"
                        + "     <th class='centered'>Bruto</th>"
                        + "     <th class='centered'>Líquido</th>"
                        + "     <th class='centered'>Ret. Espec</th>"
                        + "     <th class='centered'>IRPF</th>"
                        + "     <th class='centered'>SSTRAB</th>"
                        + "     <th class='centered'>SSEMP</th>"
                        + "     <th class='centered'>Total C1</th>"
                        + "     <th class='centered'>Coste empresa</th>"
                        + "     <th class='centered'>Embargo</th>"
                        + "     <th class='centered'>Dietas mes</th>"
                        + "     <th class='centered'>Plus disponibilidad</th>"
                        + "     <th class='centered'>Provisión pagas extras</th>"
                        + "     <th class='centered'>Descuentos</th>"
                        + "</tr></thead><tbody></tbody>");

    $.each(allUsers, function(index){
        var color = '';
        switch (this.type) {
            case '1':
                color = '#0080FF';
                break;
            case '2':
                color = '#DF0101';
                break;
            case '3':
                color = '#F7D358';
                break;
            case '4':
                color = '#088A08';
                break;
            case '5':
                color = '#088A08';
                break;
            case '6':
                color = '#614126';
                break;
            case '7':
                color = '#002490';
                break;
            case '8':
                color = '#265e61';
                break;
            case '9':
                color = '#60d55a';
                break;
            case '10':
                color = '#c95ad5';
                break;
            case '1':
                color = '#d5b65a';
                break;
            default:
                color = 'white';
                break;
        }
        $('#salaries tbody').append("<tr id='" + index + "'>"
                                    + "<td id='staff" + index + "' class='hide'>" + this.ID + "</td>"
                                    + "<td class='centered'><input type='checkbox' id='check" + index + "'></td>"
                                    + "<td class='centered' style='background-color:" + color + ";' id='surname' >" + this.name + " " + this.surname + "</td>"
                                    + "<td class='centered'><input id='gross" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='liquid" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='retribution" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='IRPF" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='SSTRAB" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='SSEMP" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='totalTC1" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='companyCost" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='seizure" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='diet" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='plus" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='extra" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "<td class='centered'><input id='discounts" + index + "' class='text-center input-medium' type='text' value='0.00'></td>"
                                    + "</tr>");
    })

    $('#saveSalaries').click(function(){
        var salariesUsers  = new Object();
        var templateName = $('#formNewSalarieTemplate #name').val();
        $.each($('#salaries tbody tr'), function(index){
            var index2 = $(this).attr('id');
            if($(this).find('#check' + index2).prop('checked')){
                salariesUsers[index] = {
                    staff: $(this).find('#staff' + index2).html(),
                    gross: $(this).find('#gross' + index2).val(),
                    liquid: $(this).find('#liquid' + index2).val(),
                    retribution: $(this).find('#retribution' + index2).val(),
                    IRPF: $(this).find('#IRPF' + index2).val(),
                    SSTRAB: $(this).find('#SSTRAB' + index2).val(),
                    SSEMP: $(this).find('#SSEMP' + index2).val(),
                    totalTC1: $(this).find('#totalTC1' + index2).val(),
                    companyCost: $(this).find('#companyCost' + index2).val(),
                    seizure: $(this).find('#seizure' + index2).val(),
                    diet: $(this).find('#diet' + index2).val(),
                    plus: $(this).find('#plus' + index2).val(),
                    extra: $(this).find('#extra' + index2).val(),
                    discounts: $(this).find('#discounts' + index2).val()
                }
            }
        });

        var validate = true;
        if(isEmpty($("#name"))){
            validate = false;
        }
        if(validate){
            saveTemplate(salariesUsers, templateName);
        }
    });
})