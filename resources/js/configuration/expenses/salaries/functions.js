function getSalariesUsers(month, year) {
    var users;
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'getSalariesUsers', month: month, year: year},
        type: 'POST',
        async: false,
        success: function (data) {
            users = $.parseJSON(data);
        }
    });
    return users;
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');
    // $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveSalaries" name="saveSalaries" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
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
        setWidthBottomToolbar();
    });

    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth();
    var month = new Array();
    month[0] = "Enero";
    month[1] = "Febrero";
    month[2] = "Marzo";
    month[3] = "Abril";
    month[4] = "Mayo";
    month[5] = "Junio";
    month[6] = "Julio";
    month[7] = "Agosto";
    month[8] = "Septiembre";
    month[9] = "Octubre";
    month[10] = "Noviembre";
    month[11] = "Diciembre";

    for (i=0; i < 12; i++){
        if(i == currentMonth){
            $('#month').append("<option value=" + i + " selected>" + month[i] + "</option>");
        }else{
            $('#month').append("<option value=" + i + ">" + month[i] + "</option>");
        }
        
    }
    $('#year').append("<option value=" + i + "selected>" + currentYear + "</option>");
    
    var date = moment(currentYear.toString()).add(currentMonth + 1, 'months').format('X');
    var salariesUsers = getSalariesUsers(currentMonth + 1, currentYear);
    
    $('#salaries').append("<thead><tr>"
                        + "     <th class='hide'>ID</th>"
                        + "     <th>Nombre</th>"
                        + "     <th>Bruto</th>"
                        + "     <th>Líquido</th>"
                        + "     <th>Ret. Espec</th>"
                        + "     <th>IRPF</th>"
                        + "     <th>SSTRAB</th>"
                        + "     <th>SSEMP</th>"
                        + "     <th>Total C1</th>"
                        + "     <th>Coste empresa</th>"
                        + "     <th>Embargo</th>"
                        + "     <th>Dietas mes</th>"
                        + "     <th>Plus disponibilidad</th>"
                        + "     <th>Provisión pagas extras</th>"
                        + "</tr></thead><tbody></tbody>");

    $.each(salariesUsers, function(){
        var color = '';
        switch (this.userType) {
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
        $('#salaries tbody').append("<tr id='" + this.salarieID + "'>"
                                    + "<td id='salariesUsersID' class='hide'>" + this.salariesUsersID + "</td>"
                                    + "<td id='userID' class='hide'>" + this.userID + "</td>"
                                    + "<td style='background-color:" + color + ";' id='surname' >" + this.name + " " + this.surname + "</td>"
                                    + "<td><input id='gross" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.gross + "'></td>"
                                    + "<td><input id='liquid" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.liquid + "'></td>"
                                    + "<td><input id='retribution" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.retribution + "'></td>"
                                    + "<td><input id='IRPF" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.IRPF + "'></td>"
                                    + "<td><input id='SSTRAB" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.SSTRAB + "'></td>"
                                    + "<td><input id='SSEMP" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.SSEMP + "'></td>"
                                    + "<td><input id='totalTC1" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.totalTC1 + "'></td>"
                                    + "<td><input id='companyCost" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.companyCost + "'></td>"
                                    + "<td><input id='seizure" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.seizure + "'></td>"
                                    + "<td><input id='diet" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.diet + "'></td>"
                                    + "<td><input id='plus" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.plus + "'></td>"
                                    + "<td><input id='extra" + this.salariesUsersID + "' class='form-control input-xs' type='text' value='" + this.extra + "'></td>"
                                    + "</tr>");
    })

    $('#saveSalaries').click(function(){
        var salariesUsers  = new Object();
        $.each($('#salaries tbody tr'), function(index){
            var salariesUsersID = $(this).find('td#salariesUsersID').html()
            salariesUsers[index] = {
                salarieID: $(this).attr('id'),
                gross: $(this).find('#gross' + salariesUsersID).val(),
                liquid: $(this).find('#liquid' + salariesUsersID).val(),
                retribution: $(this).find('#retribution' + salariesUsersID).val(),
                IRPF: $(this).find('#IRPF' + salariesUsersID).val(),
                SSTRAB: $(this).find('#SSTRAB' + salariesUsersID).val(),
                SSERP: $(this).find('#SSERP' + salariesUsersID).val(),
                totalTC1: $(this).find('#totalTC1' + salariesUsersID).val(),
                companyCost: $(this).find('#companyCost' + salariesUsersID).val(),
                seizure: $(this).find('#seizure' + salariesUsersID).val(),
                diet: $(this).find('#diet' + salariesUsersID).val(),
                plus: $(this).find('#plus' + salariesUsersID).val(),
                extra: $(this).find('#extra' + salariesUsersID).val(),
            }
        });
    });
})