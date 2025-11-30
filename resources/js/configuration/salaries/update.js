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

function getTemplate(idTemplate) {
    var template;
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'getTemplate', template: idTemplate},
        type: 'POST',
        async: false,
        success: function (data) {
            template = $.parseJSON(data);
        }
    });
    return template;
}

function updateTemplate(salariesUsers, templateName, template) {
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'updateTemplate', salariesUsers: salariesUsers, template: template, templateName: templateName},
        type: 'POST',
        async: false,
        success: function (data) {
            data = $.parseJSON(data);
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los sueldos han sido actualizados.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else{
                $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición no se ha podido realizar en estos momentos.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        }
    });
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
    // $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
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
    
    var url = window.location.pathname.split('/');
    var template = url[url.length - 1];
    
    var allUsers = getAllUsersExcepTemplates();
    var usersTemplate = getTemplate(template);

    var nameTemplate = usersTemplate[0].templateName;
    $('#formEditSalarieTemplate #name').val(nameTemplate)

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
        $('#salaries tbody').append("<tr id='" + index + "'>"
                                    + "<td id='staff" + index + "' class='hide'>" + this.ID + "</td>"
                                    + "<td class='centered'><input type='checkbox' id='check" + index + "'></td>"
                                    + "<td class='centered' id='surname' >" + this.name + " " + this.surname + "</td>"
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

    $('#salaries tbody tr').each(function(index, elem){
        var row = $(this)
        var staff = row.find('td#staff' + index).html()

        $.each(usersTemplate, function(key, value){
            if(value.staff == staff){
                row.find('td input#check' + index).prop('checked', true)
                row.find('td input#gross' + index).val(value.gross)
                row.find('td input#liquid' + index).val(value.liquid)
                row.find('td input#retribution' + index).val(value.retribution)
                row.find('td input#IRPF' + index).val(value.IRPF)
                row.find('td input#SSTRAB' + index).val(value.SSTRAB)
                row.find('td input#SSEMP' + index).val(value.SSEMP)
                row.find('td input#totalTC1' + index).val(value.totalTC1)
                row.find('td input#companyCost' + index).val(value.companyCost)
                row.find('td input#seizure' + index).val(value.seizure)
                row.find('td input#diet' + index).val(value.diet)
                row.find('td input#plus' + index).val(value.plus)
                row.find('td input#extra' + index).val(value.extra)
                row.find('td input#discounts' + index).val(value.discounts)
            }
        })
    })

    $('#saveSalaries').click(function(){
        var validate = 0;

        var salariesUsers  = new Object();
        var templateName = $('#formEditSalarieTemplate #name').val();
        
        $.each($('#salaries tbody tr'), function(index){
            var index2 = $(this).attr('id');
            if($(this).find('#check' + index2).prop('checked')){
                if($(this).find('#gross' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#liquid' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#retribution' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#IRPF' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#SSTRAB' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#SSEMP' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#totalTC1' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#companyCost' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#seizure' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#diet' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#plus' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#extra' + index2).val() == ''){
                    validate++
                }
                if($(this).find('#discounts' + index2).val() == ''){
                    validate++
                }
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

        if(isEmpty($("#name"))){
            validate++;
        }
        if(validate == 0){
            updateTemplate(salariesUsers, templateName, template);
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    });
    
    //Sticky Table Header
    $('#configTableSalaries #salaries').stickyTableHeaders();
    $('#configTableSalaries #salaries').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');
})