function getSalariesTemplates() {
    var templates;
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'getSalariesTemplates'},
        type: 'POST',
        async: false,
        success: function (data) {
            templates = $.parseJSON(data);
        }
    });
    return templates;
}

function getSalariesUsers(date) {
    var users;
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'getSalariesUsers', date: date},
        type: 'POST',
        async: false,
        success: function (data) {
            users = $.parseJSON(data);
        }
    });
    return users;
}

function updateSalaries(salariesUsers) {
    $.ajax({
        url: uri + "core/salaries/functions.php",
        data: {type: 'updateSalaries', salariesUsers: salariesUsers},
        type: 'POST',
        async: false,
        success: function (data) {
            data = $.parseJSON(data);
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los sueldos han sido actualizados.</div>');
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            }else{
                $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición no se ha podido realizar en estos momentos.</div>');
            }
        }
    });
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    moment.locale('es');
    
    var templates = getSalariesTemplates();
    $.each(templates, function(){
        $('#salariesTemplates').append('<li><a id="' + this.ID + '" class="templateSelect">' + this.name + '</a></li>');
    });
    
    var url = window.location.pathname.split('/');
    var date = url[url.length - 1];

    var year = moment(date, 'X').format('YYYY');
    var month = moment(date, 'X').format('MMMM');
    month = month.charAt(0).toUpperCase() + month.slice(1);
    $('.box-title').html('<i class="fa fa-percent" aria-hidden="true"></i> Gestión de sueldos y salarios - ' + month + ' de ' + year);

    var salariesUsers = getSalariesUsers(date);
    if(salariesUsers == null){
        $('#existsSalary').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'salidas/sueldos-salarios'
        }, 2500)
        return
    }else{
        $('#existsSalary').remove()
    }

    $('#salaries').append("<thead><tr>"
                        + "     <th class='hide'>I</th>"
                        + "     <th class='hide'>S</th>"
                        + "     <th>Código</th>"
                        + "     <th class='centered'>Nombre</th>"
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
                        + "     <th class='centered'>Descuentos</th>"
                        + "</tr></thead><tbody></tbody>");

    var gross = 0
    var liquid = 0
    var retribution = 0
    var IRPF = 0
    var SSTRAB = 0
    var SSEMP = 0
    var totalTC1 = 0
    var companyCost = 0
    var seizure = 0
    var diet = 0
    var plus = 0
    var extra = 0
    var discounts = 0
    var workers = 0
    $.each(salariesUsers, function(index){
        $('#salaries tbody').append("<tr class='data' id='" + index + "'>"
                                    + "<td id='salaryID' class='dat hide'>" + this.ID + "</td>"
                                    + "<td id='staff" + index + "' class='hide'>" + this.staff + "</td>"
                                    + "<td id='staffCode" + index + "'>" + this.code + "</td>"
                                    + "<td class='centered' id='surname' >" + this.name + " " + this.surname + "</td>"
                                    + "<td class='centered'><input id='gross" + index + "' class='text-center input-medium' type='text' value='" + this.gross + "'></td>"
                                    + "<td class='centered'><input id='liquid" + index + "' class='text-center input-medium' type='text' value='" + this.liquid + "'></td>"
                                    + "<td class='centered'><input id='retribution" + index + "' class='text-center input-medium' type='text' value='" + this.retribution + "'></td>"
                                    + "<td class='centered'><input id='IRPF" + index + "' class='text-center input-medium' type='text' value='" + this.IRPF + "'></td>"
                                    + "<td class='centered'><input id='SSTRAB" + index + "' class='text-center input-medium' type='text' value='" + this.SSTRAB + "'></td>"
                                    + "<td class='centered'><input id='SSEMP" + index + "' class='text-center input-medium' type='text' value='" + this.SSEMP + "'></td>"
                                    + "<td class='centered'><input id='totalTC1" + index + "' class='text-center input-medium' type='text' value='" + this.totalTC1 + "'></td>"
                                    + "<td class='centered'><input id='companyCost" + index + "' class='text-center input-medium' type='text' value='" + this.companyCost + "'></td>"
                                    + "<td class='centered'><input id='seizure" + index + "' class='text-center input-medium' type='text' value='" + this.seizure + "'></td>"
                                    + "<td class='centered'><input id='diet" + index + "' class='text-center input-medium' type='text' value='" + this.diet + "'></td>"
                                    + "<td class='centered'><input id='plus" + index + "' class='text-center input-medium' type='text' value='" + this.plus + "'></td>"
                                    + "<td class='centered'><input id='extra" + index + "' class='text-center input-medium' type='text' value='" + this.extra + "'></td>"
                                    + "<td class='centered'><input id='discounts" + index + "' class='text-center input-medium' type='text' value='" + this.discounts + "'></td>"
                                    + "</tr>");

        gross += parseFloat(this.gross)
        liquid += parseFloat(this.liquid)
        retribution += parseFloat(this.retribution)
        IRPF += parseFloat(this.IRPF)
        SSTRAB += parseFloat(this.SSTRAB)
        SSEMP += parseFloat(this.SSEMP)
        totalTC1 += parseFloat(this.totalTC1)
        companyCost += parseFloat(this.companyCost)
        seizure += parseFloat(this.seizure)
        diet += parseFloat(this.diet)
        plus += parseFloat(this.plus)
        extra += parseFloat(this.extra)
        discounts += parseFloat(this.discounts)

        if(this.gross != '0.00'){
            workers++
        }
    })

    $('#salaries tbody').append('   <tr>' +
                                '       <td class="centered hide"></td>' +
                                '       <td class="centered hide"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered">Total empresa</td>' +
                                '       <td class="centered">' + gross.toFixed(2) + '</td>' +
                                '       <td class="centered">' + liquid.toFixed(2) + '</td>' +
                                '       <td class="centered">' + retribution.toFixed(2) + '</td>' +
                                '       <td class="centered">' + IRPF.toFixed(2) + '</td>' +
                                '       <td class="centered">' + SSTRAB.toFixed(2) + '</td>' +
                                '       <td class="centered">' + SSEMP.toFixed(2) + '</td>' +
                                '       <td class="centered">' + totalTC1.toFixed(2) + '</td>' +
                                '       <td class="centered">' + companyCost.toFixed(2) + '</td>' +
                                '       <td class="centered">' + seizure.toFixed(2) + '</td>' +
                                '       <td class="centered">' + diet.toFixed(2) + '</td>' +
                                '       <td class="centered">' + plus.toFixed(2) + '</td>' +
                                '       <td class="centered">' + extra.toFixed(2) + '</td>' +
                                '       <td class="centered">' + discounts.toFixed(2) + '</td>' +
                                '   </tr>')

    $('#salaries tbody').append('   <tr>' +
                                '       <td class="centered hide"></td>' +
                                '       <td class="centered hide"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered">Total trabajadores empresa</td>' +
                                '       <td class="centered">' + workers + '</td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '       <td class="centered"></td>' +
                                '   </tr>')

    $('.templateSelect').click(function(){
        var template = $(this).attr('id');

        var usersTemplate = getTemplate(template);
        $.each($('#salaries tbody tr'), function(index){
            var row = $(this);
            $.each(usersTemplate, function(){
                if(row.find('#staff' + index).html() == this.staff){
                    row.find('#gross' + index).val(this.gross);
                    row.find('#liquid' + index).val(this.liquid);
                    row.find('#retribution' + index).val(this.retribution);
                    row.find('#IRPF' + index).val(this.IRPF);
                    row.find('#SSTRAB' + index).val(this.SSTRAB);
                    row.find('#SSEMP' + index).val(this.SSEMP);
                    row.find('#totalTC1' + index).val(this.totalTC1);
                    row.find('#companyCost' + index).val(this.companyCost);
                    row.find('#seizure' + index).val(this.seizure);
                    row.find('#diet' + index).val(this.diet);
                    row.find('#plus' + index).val(this.plus);
                    row.find('#extra' + index).val(this.extra);
                }
            });
        });
    });

    $('#saveSalaries').click(function(){
        var validate = 0
        var salariesUsers  = new Object();
        $.each($('#salaries tbody tr.data'), function(index){
            var index2 = $(this).attr('id');
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
            salariesUsers[index] = {
                salarieID: index2,
                date: date,
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
            }
        });

        if(validate == 0){
            updateSalaries(salariesUsers);
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#warning-message').empty()
            }, 3500)
        }
    });

    //Sticky Table Header
    $('#tableSalaries #salaries').stickyTableHeaders();
    $('#tableSalaries #salaries').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    // Carga el fichero de salarios
    $('#load').click(function(){
        var filelist = $('#loadFile')[0].files

        if(filelist.length == 0){
            $('#fileMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un archivo para cargar</div>')
            setTimeout(function(){
                $('#fileMessage').empty()
            }, 5000)
        }else if(filelist[0].name.split('.')[filelist[0].name.split('.').length - 1] != 'xls' && filelist[0].name.split('.')[filelist[0].name.split('.').length - 1] != 'xlsx'){
            $('#fileMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un formato de archivo válido</div>')
            setTimeout(function(){
                $('#fileMessage').empty()
            }, 5000)
        }else{
            var data = new FormData

            data.append('file', filelist[0])
            data.append('date', date)
            data.append('type', 'loadSalaries')

            $.ajax({
                url: uri + 'core/salaries/functions.php',
                method: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        $('#fileMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                        setTimeout(function(){
                            window.location.reload()
                        }, 1000)
                    }catch(e){
                        $('#fileMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                        setTimeout(function(){
                            $('#fileMessage').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#fileMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                    setTimeout(function(){
                        $('#fileMessage').empty()
                    }, 5000)
                }
            })
        }
    })

    $('#downloadSalaries').click(function(){
        $.ajax({
            url: uri + 'core/salaries/functions.php',
            method: 'POST',
            data: {
                type: 'downloadSalaries',
                date: date
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
                window.open(uri + 'descargar-archivoExcel?file=salaries/salaries.csv', '_blank')
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición no se ha podido realizar en estos momentos.</div>');
            }
        })
    })
})