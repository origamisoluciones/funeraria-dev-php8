/**
 * @var {object} totals Tabla de totales
 */
var totals

var totalTableLoad = false
var yearsTotalFlag = false

/**
 * @var {object} cremations Tabla de cremaciones
 */
var cremations

var cremationsTableLoad = false
var yearsCremationsFlag = false

var deceasedByYearFlag = false
var deceasedByYearDayFlag = false
var deceasedByYearNightFlag = false
var dayvsnightYearsFlag = false
var nightvsdayYearsFlag = false

var months = new Array; 

// SELECT2
$.fn.select2.defaults.set("width", "100%");
$('.select2').select2({
    language: 'es',
    placeholder: '--',
    allowClear: true
});

var limit_page = 10;

/**
 * Idioma del select2
 */
 var langSelect2 = {
    inputTooShort: function(args) {
        return "Escribir ..."
    },
    inputTooLong: function(args) {
        return "Término demasiado largo"
    },
    errorLoading: function() {
        return "No hay resultados"
    },
    loadingMore: function() {
        return "Cargando más resultados"
    },
    noResults: function() {
        return "No hay resultados"
    },
    searching: function() {
        return "Buscando..."
    },
    maximumSelected: function(args) {
        return "No hay resultados"
    }
}

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

//Obtiene la fecha de la primera factura para un tanatorio propio
function getFirstExpedientDate() {
    var date;
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {type: 'getFirstExpedientDate'},
        type: 'POST',
        async: false,
        success: function (data) {
            date = $.parseJSON(data);
            if(date == null){
                date = moment((new Date()).getFullYear(), "YYYY").format("X");
            }else{
                date = moment(date, "YYYY-MM-DD HH:mm:ss").format("X");
            }
        }
    });
    return date;
}

/**
 * Obtiene los datos de todos los selects rellenables
 */
function fillSelect(){
    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'fillSelectsGeneral'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                // Total - Años
                $('#yearsTotal').append('<option value="-">-</option>')
                $('#yearsSummary').append('<option value="-">-</option>')
                $('#yearsCremations').append('<option value="-">-</option>')
                currentYear = (new Date()).getFullYear();
                $.each(data.yearsTotal, function(index, elem){
                    if(elem.year == currentYear){
                        selected = "selected"
                    }else{
                        selected = ""
                    }
                    $('#yearsTotal').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#yearsSummary').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#yearsCremations').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#deceasedByYearChartYearsD').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#deceasedByYearChartYearsC').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#deceasedByYearChartYearsS').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#deceasedByYearChartYearsDS').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#deceasedByYearDayChartYears').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#deceasedByYearNightChartYears').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#dayvsnightChartYears').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#yearCremations').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#yearCremationsWeek').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#yearJudiciales').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#yearJudicialesWeek').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                    $('#nightvsdayChartYears').append('<option value="' + elem.year + '" ' + selected +'>' + elem.year + '</option>')
                })

                yearsTotalFlag = true
                yearsCremationsFlag = true
                deceasedByYearFlag = true
                deceasedByYearDayFlag = true
                deceasedByYearNightFlag = true
                dayvsnightYearsFlag = true
                nightvsdayYearsFlag = true
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
    })
}

/**
 * Obtiene los resultados de la tabla de resumen por año
 * 
 * @param {int} year Año
 */
function getSummary(year){
    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getSummaryGeneral',
            year: year
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                // Lunes
                var dayMonday = 0
                var nightMonday = 0
                $.each(data.monday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightMonday++ : dayMonday++
                    }
                })

                var dayPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (dayMonday / (dayMonday + nightMonday) * 100).toFixed(2)
                var nightPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (nightMonday / (dayMonday + nightMonday) * 100).toFixed(2)

                $('#summary-table #dayTotalMonday').html(dayMonday + nightMonday)
                $('#summary-table #dayMonday').html(dayMonday)
                $('#summary-table #nightMonday').html(nightMonday)
                $('#summary-table #dayPercentMonday').html(dayPercentMonday + ' %')
                $('#summary-table #nightPercentMonday').html(nightPercentMonday + ' %')

                // Martes
                var dayTuesday = 0
                var nightTuesday = 0
                $.each(data.tuesday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightTuesday++ : dayTuesday++
                    }
                })

                var dayPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (dayTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)
                var nightPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (nightTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)

                $('#summary-table #dayTotalTuesday').html(dayTuesday + nightTuesday)
                $('#summary-table #dayTuesday').html(dayTuesday)
                $('#summary-table #nightTuesday').html(nightTuesday)
                $('#summary-table #dayPercentTuesday').html(dayPercentTuesday + ' %')
                $('#summary-table #nightPercentTuesday').html(nightPercentTuesday + ' %')

                // Miércoles
                var dayWednesday = 0
                var nightWednesday = 0
                $.each(data.wednesday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightWednesday++ : dayWednesday++
                    }
                })

                var dayPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (dayWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)
                var nightPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (nightWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)

                $('#summary-table #dayTotalWednesday').html(dayWednesday + nightWednesday)
                $('#summary-table #dayWednesday').html(dayWednesday)
                $('#summary-table #nightWednesday').html(nightWednesday)
                $('#summary-table #dayPercentWednesday').html(dayPercentWednesday + ' %')
                $('#summary-table #nightPercentWednesday').html(nightPercentWednesday + ' %')

                // Jueves
                var dayThursday = 0
                var nightThursday = 0
                $.each(data.thursday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightThursday++ : dayThursday++
                    }
                })

                var dayPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-' : (dayThursday / (dayThursday + nightThursday) * 100).toFixed(2)
                var nightPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-' : (nightThursday / (dayThursday + nightThursday) * 100).toFixed(2)

                $('#summary-table #dayTotalThursday').html(dayThursday + nightThursday)
                $('#summary-table #dayThursday').html(dayThursday)
                $('#summary-table #nightThursday').html(nightThursday)
                $('#summary-table #dayPercentThursday').html(dayPercentThursday + ' %')
                $('#summary-table #nightPercentThursday').html(nightPercentThursday + ' %')

                // Viernes
                var dayFriday = 0
                var nightFriday = 0
                $.each(data.friday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightFriday++ : dayFriday++
                    }
                })

                var dayPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (dayFriday / (dayFriday + nightFriday) * 100).toFixed(2)
                var nightPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (nightFriday / (dayFriday + nightFriday) * 100).toFixed(2)

                $('#summary-table #dayTotalFriday').html(dayFriday + nightFriday)
                $('#summary-table #dayFriday').html(dayFriday)
                $('#summary-table #nightFriday').html(nightFriday)
                $('#summary-table #dayPercentFriday').html(dayPercentFriday + ' %')
                $('#summary-table #nightPercentFriday').html(nightPercentFriday + ' %')

                // Sábado
                var daySaturday = 0
                var nightSaturday = 0
                $.each(data.saturday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSaturday++ : daySaturday++
                    }
                })

                var dayPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (daySaturday / (daySaturday + nightSaturday) * 100).toFixed(2)
                var nightPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (nightSaturday / (daySaturday + nightSaturday) * 100).toFixed(2)

                $('#summary-table #dayTotalSaturday').html(daySaturday + nightSaturday)
                $('#summary-table #daySaturday').html(daySaturday)
                $('#summary-table #nightSaturday').html(nightSaturday)
                $('#summary-table #dayPercentSaturday').html(dayPercentSaturday + ' %')
                $('#summary-table #nightPercentSaturday').html(nightPercentSaturday + ' %')

                // Domingo
                var daySunday = 0
                var nightSunday = 0
                $.each(data.sunday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSunday++ : daySunday++
                    }
                })

                var dayPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (daySunday / (daySunday + nightSunday) * 100).toFixed(2)
                var nightPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (nightSunday / (daySunday + nightSunday) * 100).toFixed(2)

                $('#summary-table #dayTotalSunday').html(daySunday + nightSunday)
                $('#summary-table #daySunday').html(daySunday)
                $('#summary-table #nightSunday').html(nightSunday)
                $('#summary-table #dayPercentSunday').html(dayPercentSunday + ' %')
                $('#summary-table #nightPercentSunday').html(nightPercentSunday + ' %')

                var totalWeek = dayMonday + dayTuesday + dayWednesday + dayThursday + dayFriday + nightMonday + nightTuesday + nightWednesday + nightThursday + nightFriday
                var totalWeekend = daySaturday + daySunday + nightSaturday + nightSunday
                var totalPercentNight = totalWeek == 0 && totalWeekend == 0 ? '-' : ((nightMonday + nightTuesday + nightWednesday + nightThursday + nightFriday + nightSaturday + nightSunday) / (totalWeek + totalWeekend) * 100).toFixed(2)
                $('#summary-total-table #totalWeek').html(totalWeek)
                $('#summary-total-table #totalWeekend').html(totalWeekend)
                $('#summary-total-table #totalPercentNight').html(totalPercentNight + ' %')

                if(data.covidMonday != 0){
                    $('#covidMonday').html(data.covidMonday.length)
                }else{
                    $('#covidMonday').html(data.covidMonday)
                }
                if(data.covidTuesday != 0){
                    $('#covidTuesday').html(data.covidTuesday.length)
                }else{
                    $('#covidTuesday').html(data.covidTuesday)
                }
                if(data.covidWednesday != 0){
                    $('#covidWednesday').html(data.covidWednesday.length)
                }else{
                    $('#covidWednesday').html(data.covidWednesday)
                }
                if(data.covidThursday != 0){
                    $('#covidThursday').html(data.covidThursday.length)
                }else{
                    $('#covidThursday').html(data.covidThursday)
                }
                if(data.covidFriday != 0){
                    $('#covidFriday').html(data.covidFriday.length)
                }else{
                    $('#covidFriday').html(data.covidFriday)
                }
                if(data.covidSaturday != 0){
                    $('#covidSaturday').html(data.covidSaturday.length)
                }else{
                    $('#covidSaturday').html(data.covidSaturday)
                }
                if(data.covidSunday != 0){
                    $('#covidSunday').html(data.covidSunday.length)
                }else{
                    $('#covidSunday').html(data.covidSunday)
                }
                $('#summaryChartSummary').empty()
                $('#summaryChartSummary').append('<canvas id="summaryChart"></canvas>')
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                max: totalWeek + totalWeekend,
                                min: 0
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: name
                    }
                }
                
                var data = {
                    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    datasets: [{
                        label: 'Defunciones por día',
                        data: [
                            dayMonday + nightMonday,
                            dayTuesday + nightTuesday,
                            dayWednesday + nightWednesday,
                            dayThursday + nightThursday,
                            dayFriday + nightFriday,
                            daySaturday + nightSaturday,
                            daySunday + nightSunday
                        ],
                        backgroundColor: [
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490'
                        ],
                        borderColor: [
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490'
                        ],
                        borderWidth: 1
                    }]
                }
                
                new Chart(document.getElementById("summaryChart"), {
                    type: 'bar',
                    data: data,
                    options: options
                })
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
    })
}

/**
 * Obtiene los resultados de la sección de defunciones totales
 * 
 * @param {int} since Desde
 * @param {int} until Hasta
 */
function getTotalDeceased(since = null, until = null){
    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getTotalDeceased',
            since: since,
            until: until
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(since != '' && until != ''){
                    $('#sinceTotalDeceased').text(moment(since, 'X').format('DD/MM/YYYY'))
                    $('#untilTotalDeceased').text(moment(until, 'X').format('DD/MM/YYYY'))
                }

                // Lunes
                var dayMonday = 0
                var nightMonday = 0
                $.each(data.monday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightMonday++ : dayMonday++
                    }
                })

                var dayPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (dayMonday / (dayMonday + nightMonday) * 100).toFixed(2)
                var nightPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (nightMonday / (dayMonday + nightMonday) * 100).toFixed(2)

                $('#deceased-table #dayTotalMonday').html(dayMonday + nightMonday)
                $('#deceased-table #dayMonday').html(dayMonday)
                $('#deceased-table #nightMonday').html(nightMonday)
                $('#deceased-table #dayPercentMonday').html(dayPercentMonday + ' %')
                $('#deceased-table #nightPercentMonday').html(nightPercentMonday + ' %')

                // Martes
                var dayTuesday = 0
                var nightTuesday = 0
                $.each(data.tuesday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightTuesday++ : dayTuesday++
                    }
                })

                var dayPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (dayTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)
                var nightPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (nightTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)

                $('#deceased-table #dayTotalTuesday').html(dayTuesday + nightTuesday)
                $('#deceased-table #dayTuesday').html(dayTuesday)
                $('#deceased-table #nightTuesday').html(nightTuesday)
                $('#deceased-table #dayPercentTuesday').html(dayPercentTuesday + ' %')
                $('#deceased-table #nightPercentTuesday').html(nightPercentTuesday + ' %')

                // Miércoles
                var dayWednesday = 0
                var nightWednesday = 0
                $.each(data.wednesday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightWednesday++ : dayWednesday++
                    }
                })

                var dayPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (dayWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)
                var nightPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (nightWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)

                $('#deceased-table #dayTotalWednesday').html(dayWednesday + nightWednesday)
                $('#deceased-table #dayWednesday').html(dayWednesday)
                $('#deceased-table #nightWednesday').html(nightWednesday)
                $('#deceased-table #dayPercentWednesday').html(dayPercentWednesday + ' %')
                $('#deceased-table #nightPercentWednesday').html(nightPercentWednesday + ' %')

                // Jueves
                var dayThursday = 0
                var nightThursday = 0
                $.each(data.thursday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightThursday++ : dayThursday++
                    }
                })

                var dayPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-' : (dayThursday / (dayThursday + nightThursday) * 100).toFixed(2)
                var nightPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-': (nightThursday / (dayThursday + nightThursday) * 100).toFixed(2)

                $('#deceased-table #dayTotalThursday').html(dayThursday + nightThursday)
                $('#deceased-table #dayThursday').html(dayThursday)
                $('#deceased-table #nightThursday').html(nightThursday)
                $('#deceased-table #dayPercentThursday').html(dayPercentThursday + ' %')
                $('#deceased-table #nightPercentThursday').html(nightPercentThursday + ' %')

                // Viernes
                var dayFriday = 0
                var nightFriday = 0
                $.each(data.friday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightFriday++ : dayFriday++
                    }
                })

                var dayPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (dayFriday / (dayFriday + nightFriday) * 100).toFixed(2)
                var nightPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (nightFriday / (dayFriday + nightFriday) * 100).toFixed(2)

                $('#deceased-table #dayTotalFriday').html(dayFriday + nightFriday)
                $('#deceased-table #dayFriday').html(dayFriday)
                $('#deceased-table #nightFriday').html(nightFriday)
                $('#deceased-table #dayPercentFriday').html(dayPercentFriday + ' %')
                $('#deceased-table #nightPercentFriday').html(nightPercentFriday + ' %')

                // Sábado
                var daySaturday = 0
                var nightSaturday = 0
                $.each(data.saturday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSaturday++ : daySaturday++
                    }
                })

                var dayPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (daySaturday / (daySaturday + nightSaturday) * 100).toFixed(2)
                var nightPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (nightSaturday / (daySaturday + nightSaturday) * 100).toFixed(2)

                $('#deceased-table #dayTotalSaturday').html(daySaturday + nightSaturday)
                $('#deceased-table #daySaturday').html(daySaturday)
                $('#deceased-table #nightSaturday').html(nightSaturday)
                $('#deceased-table #dayPercentSaturday').html(dayPercentSaturday + ' %')
                $('#deceased-table #nightPercentSaturday').html(nightPercentSaturday + ' %')

                // Domingo
                var daySunday = 0
                var nightSunday = 0
                $.each(data.sunday, function(index, elem){
                    if(elem.requestTime != null){
                        var time = moment(elem.requestTime, 'HH:mm').format('X')
                        time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSunday++ : daySunday++
                    }
                })

                var dayPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (daySunday / (daySunday + nightSunday) * 100).toFixed(2)
                var nightPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (nightSunday / (daySunday + nightSunday) * 100).toFixed(2)

                $('#deceased-table #dayTotalSunday').html(daySunday + nightSunday)
                $('#deceased-table #daySunday').html(daySunday)
                $('#deceased-table #nightSunday').html(nightSunday)
                $('#deceased-table #dayPercentSunday').html(dayPercentSunday + ' %')
                $('#deceased-table #nightPercentSunday').html(nightPercentSunday + ' %')

                var totalWeek = dayMonday + dayTuesday + dayWednesday + dayThursday + dayFriday + nightMonday + nightTuesday + nightWednesday + nightThursday + nightFriday
                var totalWeekend = daySaturday + daySunday + nightSaturday + nightSunday
                var total = totalWeek + totalWeekend
                var totalPercentDay = totalWeek == 0 && totalWeekend == 0 ? '-' : ((dayMonday + dayTuesday + dayWednesday + dayThursday + dayFriday + daySaturday + daySunday) / (totalWeek + totalWeekend) * 100).toFixed(2)
                var totalPercentNight = totalWeek == 0 && totalWeekend == 0 ? '-' : ((nightMonday + nightTuesday + nightWednesday + nightThursday + nightFriday + nightSaturday + nightSunday) / (totalWeek + totalWeekend) * 100).toFixed(2)
                var totalPercentWeekend = totalWeek == 0 && totalWeekend == 0 ? '-' : (totalWeekend / (totalWeek + totalWeekend) * 100).toFixed(2)
                $('#deceased-total-table #total').html(total)
                $('#deceased-total-table #totalWeek').html(totalWeek)
                $('#deceased-total-table #totalWeekend').html(totalWeekend)
                $('#deceased-total-table #totalPercentDay').html(totalPercentDay + ' %')
                $('#deceased-total-table #totalPercentNight').html(totalPercentNight + ' %')
                $('#deceased-total-table #totalPercentWeekend').html(totalPercentWeekend + ' %')

                $('#totalDeceasedChartSection').empty()
                $('#totalDeceasedChartSection').append('<canvas id="totalDeceasedChart"></canvas>')
                
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                max: totalWeek + totalWeekend,
                                min: 0
                            }
                        }]
                    }
                }
                
                var data = {
                    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    datasets: [{
                        label: 'Defunciones por día',
                        data: [
                            dayMonday + nightMonday,
                            dayTuesday + nightTuesday,
                            dayWednesday + nightWednesday,
                            dayThursday + nightThursday,
                            dayFriday + nightFriday,
                            daySaturday + nightSaturday,
                            daySunday + nightSunday
                        ],
                        backgroundColor: [
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490'
                        ],
                        borderColor: [
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490'
                        ],
                        borderWidth: 1
                    }]
                }
                
                new Chart(document.getElementById("totalDeceasedChart"), {
                    type: 'bar',
                    data: data,
                    options: options
                })

                // Día vs noche
                $('#dayNightDeceasedChartSection').empty()
                $('#dayNightDeceasedChartSection').append('<canvas id="dayNightDeceasedChart"></canvas>')

                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                max: total,
                                min: 0
                            }
                        }]
                    }
                }
                
                var data = {
                    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    datasets: [{
                        label: 'Día',
                        data: [
                            dayMonday,
                            dayTuesday,
                            dayWednesday,
                            dayThursday,
                            dayFriday,
                            daySaturday,
                            daySunday
                        ],
                        backgroundColor: [
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490'
                        ],
                        borderColor: [
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490',
                            '#002490'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Noche',
                        data: [
                            nightMonday,
                            nightTuesday,
                            nightWednesday,
                            nightThursday,
                            nightFriday,
                            nightSaturday,
                            nightSunday
                        ],
                        backgroundColor: [
                            'grey',
                            'grey',
                            'grey',
                            'grey',
                            'grey',
                            'grey',
                            'grey'
                        ],
                        borderColor: [
                            'grey',
                            'grey',
                            'grey',
                            'grey',
                            'grey',
                            'grey',
                            'grey'
                        ],
                        borderWidth: 1
                    }]
                }
                
                new Chart(document.getElementById("dayNightDeceasedChart"), {
                    type: 'bar',
                    data: data,
                    options: options
                })
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
    })
}

/**
 * Obtiene los datos para la sección de defunciones por año
 */
function getDeceasedByYear(){
    $('#deceasedByYearBodyD').empty()
    $('#deceasedByYearBodyC').empty()
    $('#deceasedByYearBodyS').empty()

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getDeceasedByYear'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                var ownDeceased = [];

                // d -> expediente defunción sin cremación ni sala
                if(data.d.length == 0){
                    $('#deceasedByYearBodyD').append('<tr><td colspan="9"><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#deceasedByYearBodyD').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>AÑO</td>' +
                        '       <td>LUNES</td>' +
                        '       <td>MARTES</td>' +
                        '       <td>MIÉRCOLES</td>' +
                        '       <td>JUEVES</td>' +
                        '       <td>VIERNES</td>' +
                        '       <td>SÁBADO</td>' +
                        '       <td>DOMINGO</td>' +
                        '       <td>TOTAL POR AÑO</td>' +
                        '   </tr>')
                    
                    data.d.sort((a, b) => a[0] > b[0] ? 1 : -1);
                    $.each(data.d , function(index, elem){
                        $('#deceasedByYearBodyD').append(
                            '   <tr class="text-center">' +
                            '       <td>' + elem[0] + '</td>' +
                            '       <td class="monday">' + elem[1] + '</td>' +
                            '       <td class="tuesday">' + elem[2] + '</td>' +
                            '       <td class="wednesday">' + elem[3] + '</td>' +
                            '       <td class="thursday">' + elem[4] + '</td>' +
                            '       <td class="friday">' + elem[5] + '</td>' +
                            '       <td class="saturday">' + elem[6] + '</td>' +
                            '       <td class="sunday">' + elem[7] + '</td>' +
                            '       <td class="totalYear toBold">' + elem[8] + '</td>' +
                            '   </tr>');

                        var filteredYear = data.s.filter(function (item) {
                            return item[0] == elem[0];
                        });
                        var totalYearDiff = 0;
                        if(filteredYear.length > 0){
                            var mondayDiff = parseInt(elem[1]) - parseInt(filteredYear[0][1]);
                            totalYearDiff += mondayDiff;
                            var tuesdayDiff = parseInt(elem[2]) - parseInt(filteredYear[0][2]);
                            totalYearDiff += tuesdayDiff;
                            var wednesdayDiff = parseInt(elem[3]) - parseInt(filteredYear[0][3]);
                            totalYearDiff += wednesdayDiff;
                            var thursdayDiff = parseInt(elem[4]) - parseInt(filteredYear[0][4]);
                            totalYearDiff += thursdayDiff;
                            var fridayDiff = parseInt(elem[5]) - parseInt(filteredYear[0][5]);
                            totalYearDiff += fridayDiff;
                            var saturdayDiff = parseInt(elem[6]) - parseInt(filteredYear[0][6]);
                            totalYearDiff += saturdayDiff;
                            var sundayDiff = parseInt(elem[7]) - parseInt(filteredYear[0][7]);
                            totalYearDiff += sundayDiff;

                            ownDeceased.push([elem[0],mondayDiff,tuesdayDiff,wednesdayDiff,thursdayDiff,fridayDiff,saturdayDiff,sundayDiff,totalYearDiff]);
                        }else{
                            ownDeceased.push([elem[0],0,0,0,0,0,0,0,0]);
                        }
                    })

                    var mondays = 0
                    $('#deceasedByYearBodyD').find('.monday').each(function(){
                        mondays += parseInt($(this).html())
                    })

                    var tuesday = 0
                    $('#deceasedByYearBodyD').find('.tuesday').each(function(){
                        tuesday += parseInt($(this).html())
                    })

                    var wednesday = 0
                    $('#deceasedByYearBodyD').find('.wednesday').each(function(){
                        wednesday += parseInt($(this).html())
                    })

                    var thursday = 0
                    $('#deceasedByYearBodyD').find('.thursday').each(function(){
                        thursday += parseInt($(this).html())
                    })

                    var friday = 0
                    $('#deceasedByYearBodyD').find('.friday').each(function(){
                        friday += parseInt($(this).html())
                    })

                    var saturday = 0
                    $('#deceasedByYearBodyD').find('.saturday').each(function(){
                        saturday += parseInt($(this).html())
                    })

                    var sunday = 0
                    $('#deceasedByYearBodyD').find('.sunday').each(function(){
                        sunday += parseInt($(this).html())
                    })

                    var total = 0
                    $('#deceasedByYearBodyD').find('.totalYear').each(function(){
                        total += parseInt($(this).html())
                    })

                    $('#deceasedByYearBodyD').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>Total por día semana</td>' +
                        '       <td>' + mondays + '</td>' +
                        '       <td>' + tuesday + '</td>' +
                        '       <td>' + wednesday + '</td>' +
                        '       <td>' + thursday + '</td>' +
                        '       <td>' + friday + '</td>' +
                        '       <td>' + saturday + '</td>' +
                        '       <td>' + sunday + '</td>' +
                        '       <td>' + total + '</td>' +
                        '   </tr>')

                    var year = $('#deceasedByYearChartYearsD').val()
                    if(year != null){
                        var toChart = []
                        $.each(data.d, function(index, elem){
                            if(elem[0] == year){
                                toChart.push(elem)

                                return false
                            }
                        })
                        
                        drawChartDeceasedByYear(toChart[0], 'D')
                    }
                    
                    $('#deceasedByYearChartYearsD').change(function(){
                        if(deceasedByYearFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(data.d, function(index, elem){
                                if(elem[0] == year){
                                    toChart.push(elem)
    
                                    return false
                                }
                            })
                            drawChartDeceasedByYear(toChart[0], 'D')
                        }
                    })
                }

                // c -> cremación
                if(data.c.length == 0){
                    $('#deceasedByYearBodyC').append('<tr><td colspan="9"><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#deceasedByYearBodyC').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>AÑO</td>' +
                        '       <td>LUNES</td>' +
                        '       <td>MARTES</td>' +
                        '       <td>MIÉRCOLES</td>' +
                        '       <td>JUEVES</td>' +
                        '       <td>VIERNES</td>' +
                        '       <td>SÁBADO</td>' +
                        '       <td>DOMINGO</td>' +
                        '       <td>TOTAL POR AÑO</td>' +
                        '   </tr>')
                    
                    data.c.sort((a, b) => a[0] > b[0] ? 1 : -1);
                    $.each(data.c , function(index, elem){
                        $('#deceasedByYearBodyC').append(
                            '   <tr class="text-center">' +
                            '       <td>' + elem[0] + '</td>' +
                            '       <td class="monday">' + elem[1] + '</td>' +
                            '       <td class="tuesday">' + elem[2] + '</td>' +
                            '       <td class="wednesday">' + elem[3] + '</td>' +
                            '       <td class="thursday">' + elem[4] + '</td>' +
                            '       <td class="friday">' + elem[5] + '</td>' +
                            '       <td class="saturday">' + elem[6] + '</td>' +
                            '       <td class="sunday">' + elem[7] + '</td>' +
                            '       <td class="totalYear toBold">' + elem[8] + '</td>' +
                            '   </tr>')
                    })

                    var mondays = 0
                    $('#deceasedByYearBodyC').find('.monday').each(function(){
                        mondays += parseInt($(this).html())
                    })

                    var tuesday = 0
                    $('#deceasedByYearBodyC').find('.tuesday').each(function(){
                        tuesday += parseInt($(this).html())
                    })

                    var wednesday = 0
                    $('#deceasedByYearBodyC').find('.wednesday').each(function(){
                        wednesday += parseInt($(this).html())
                    })

                    var thursday = 0
                    $('#deceasedByYearBodyC').find('.thursday').each(function(){
                        thursday += parseInt($(this).html())
                    })

                    var friday = 0
                    $('#deceasedByYearBodyC').find('.friday').each(function(){
                        friday += parseInt($(this).html())
                    })

                    var saturday = 0
                    $('#deceasedByYearBodyC').find('.saturday').each(function(){
                        saturday += parseInt($(this).html())
                    })

                    var sunday = 0
                    $('#deceasedByYearBodyC').find('.sunday').each(function(){
                        sunday += parseInt($(this).html())
                    })

                    var total = 0
                    $('#deceasedByYearBodyC').find('.totalYear').each(function(){
                        total += parseInt($(this).html())
                    })

                    $('#deceasedByYearBodyC').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>Total por día semana</td>' +
                        '       <td>' + mondays + '</td>' +
                        '       <td>' + tuesday + '</td>' +
                        '       <td>' + wednesday + '</td>' +
                        '       <td>' + thursday + '</td>' +
                        '       <td>' + friday + '</td>' +
                        '       <td>' + saturday + '</td>' +
                        '       <td>' + sunday + '</td>' +
                        '       <td>' + total + '</td>' +
                        '   </tr>')

                    var year = $('#deceasedByYearChartYearsC').val()
                    if(year != null){
                        var toChart = []
                        $.each(data.c, function(index, elem){
                            if(elem[0] == year){
                                toChart.push(elem)

                                return false
                            }
                        })
                        
                        drawChartDeceasedByYear(toChart[0], 'C')
                    }
                    
                    $('#deceasedByYearChartYearsC').change(function(){
                        if(deceasedByYearFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(data.c, function(index, elem){
                                if(elem[0] == year){
                                    toChart.push(elem)
    
                                    return false
                                }
                            })
                            drawChartDeceasedByYear(toChart[0], 'C')
                        }
                    })
                }

                // s -> sala
                if(data.s.length == 0){
                    $('#deceasedByYearBodyS').append('<tr><td colspan="9"><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#deceasedByYearBodyS').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>AÑO</td>' +
                        '       <td>LUNES</td>' +
                        '       <td>MARTES</td>' +
                        '       <td>MIÉRCOLES</td>' +
                        '       <td>JUEVES</td>' +
                        '       <td>VIERNES</td>' +
                        '       <td>SÁBADO</td>' +
                        '       <td>DOMINGO</td>' +
                        '       <td>TOTAL POR AÑO</td>' +
                        '   </tr>')
                    
                    data.s.sort((a, b) => a[0] > b[0] ? 1 : -1);
                    $.each(data.s , function(index, elem){
                        $('#deceasedByYearBodyS').append(
                            '   <tr class="text-center">' +
                            '       <td>' + elem[0] + '</td>' +
                            '       <td class="monday">' + elem[1] + '</td>' +
                            '       <td class="tuesday">' + elem[2] + '</td>' +
                            '       <td class="wednesday">' + elem[3] + '</td>' +
                            '       <td class="thursday">' + elem[4] + '</td>' +
                            '       <td class="friday">' + elem[5] + '</td>' +
                            '       <td class="saturday">' + elem[6] + '</td>' +
                            '       <td class="sunday">' + elem[7] + '</td>' +
                            '       <td class="totalYear toBold">' + elem[8] + '</td>' +
                            '   </tr>')
                    })

                    var mondays = 0
                    $('#deceasedByYearBodyS').find('.monday').each(function(){
                        mondays += parseInt($(this).html())
                    })

                    var tuesday = 0
                    $('#deceasedByYearBodyS').find('.tuesday').each(function(){
                        tuesday += parseInt($(this).html())
                    })

                    var wednesday = 0
                    $('#deceasedByYearBodyS').find('.wednesday').each(function(){
                        wednesday += parseInt($(this).html())
                    })

                    var thursday = 0
                    $('#deceasedByYearBodyS').find('.thursday').each(function(){
                        thursday += parseInt($(this).html())
                    })

                    var friday = 0
                    $('#deceasedByYearBodyS').find('.friday').each(function(){
                        friday += parseInt($(this).html())
                    })

                    var saturday = 0
                    $('#deceasedByYearBodyS').find('.saturday').each(function(){
                        saturday += parseInt($(this).html())
                    })

                    var sunday = 0
                    $('#deceasedByYearBodyS').find('.sunday').each(function(){
                        sunday += parseInt($(this).html())
                    })

                    var total = 0
                    $('#deceasedByYearBodyS').find('.totalYear').each(function(){
                        total += parseInt($(this).html())
                    })

                    $('#deceasedByYearBodyS').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>Total por día semana</td>' +
                        '       <td>' + mondays + '</td>' +
                        '       <td>' + tuesday + '</td>' +
                        '       <td>' + wednesday + '</td>' +
                        '       <td>' + thursday + '</td>' +
                        '       <td>' + friday + '</td>' +
                        '       <td>' + saturday + '</td>' +
                        '       <td>' + sunday + '</td>' +
                        '       <td>' + total + '</td>' +
                        '   </tr>')

                    var year = $('#deceasedByYearChartYearsS').val()
                    if(year != null){
                        var toChart = []
                        $.each(data.s, function(index, elem){
                            if(elem[0] == year){
                                toChart.push(elem)

                                return false
                            }
                        })
                        
                        drawChartDeceasedByYear(toChart[0], 'S')
                    }
                    
                    $('#deceasedByYearChartYearsS').change(function(){
                        if(deceasedByYearFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(data.s, function(index, elem){
                                if(elem[0] == year){
                                    toChart.push(elem)
    
                                    return false
                                }
                            })
                            drawChartDeceasedByYear(toChart[0], 'S')
                        }
                    })
                }

                // ds -> difference about d and s 
                if(ownDeceased.length == 0){
                    $('#deceasedByYearBodyDS').append('<tr><td colspan="9"><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#deceasedByYearBodyDS').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>AÑO</td>' +
                        '       <td>LUNES</td>' +
                        '       <td>MARTES</td>' +
                        '       <td>MIÉRCOLES</td>' +
                        '       <td>JUEVES</td>' +
                        '       <td>VIERNES</td>' +
                        '       <td>SÁBADO</td>' +
                        '       <td>DOMINGO</td>' +
                        '       <td>TOTAL POR AÑO</td>' +
                        '   </tr>')
                    
                    ownDeceased.sort((a, b) => a[0] > b[0] ? 1 : -1);
                    $.each(ownDeceased , function(index, elem){
                        $('#deceasedByYearBodyDS').append(
                            '   <tr class="text-center">' +
                            '       <td>' + elem[0] + '</td>' +
                            '       <td class="monday">' + elem[1] + '</td>' +
                            '       <td class="tuesday">' + elem[2] + '</td>' +
                            '       <td class="wednesday">' + elem[3] + '</td>' +
                            '       <td class="thursday">' + elem[4] + '</td>' +
                            '       <td class="friday">' + elem[5] + '</td>' +
                            '       <td class="saturday">' + elem[6] + '</td>' +
                            '       <td class="sunday">' + elem[7] + '</td>' +
                            '       <td class="totalYear toBold">' + elem[8] + '</td>' +
                            '   </tr>');
                    })

                    var mondays = 0
                    $('#deceasedByYearBodyDS').find('.monday').each(function(){
                        mondays += parseInt($(this).html())
                    })

                    var tuesday = 0
                    $('#deceasedByYearBodyDS').find('.tuesday').each(function(){
                        tuesday += parseInt($(this).html())
                    })

                    var wednesday = 0
                    $('#deceasedByYearBodyDS').find('.wednesday').each(function(){
                        wednesday += parseInt($(this).html())
                    })

                    var thursday = 0
                    $('#deceasedByYearBodyDS').find('.thursday').each(function(){
                        thursday += parseInt($(this).html())
                    })

                    var friday = 0
                    $('#deceasedByYearBodyDS').find('.friday').each(function(){
                        friday += parseInt($(this).html())
                    })

                    var saturday = 0
                    $('#deceasedByYearBodyDS').find('.saturday').each(function(){
                        saturday += parseInt($(this).html())
                    })

                    var sunday = 0
                    $('#deceasedByYearBodyDS').find('.sunday').each(function(){
                        sunday += parseInt($(this).html())
                    })

                    var total = 0
                    $('#deceasedByYearBodyDS').find('.totalYear').each(function(){
                        total += parseInt($(this).html())
                    })

                    $('#deceasedByYearBodyDS').append(
                        '   <tr class="text-center toBold">' +
                        '       <td>Total por día semana</td>' +
                        '       <td>' + mondays + '</td>' +
                        '       <td>' + tuesday + '</td>' +
                        '       <td>' + wednesday + '</td>' +
                        '       <td>' + thursday + '</td>' +
                        '       <td>' + friday + '</td>' +
                        '       <td>' + saturday + '</td>' +
                        '       <td>' + sunday + '</td>' +
                        '       <td>' + total + '</td>' +
                        '   </tr>')

                    var year = $('#deceasedByYearChartYearsDS').val()
                    if(year != null){
                        var toChart = []
                        $.each(ownDeceased, function(index, elem){
                            if(elem[0] == year){
                                toChart.push(elem)

                                return false
                            }
                        })
                        
                        drawChartDeceasedByYear(toChart[0], 'DS')
                    }
                    
                    $('#deceasedByYearChartYearsDS').change(function(){
                        if(deceasedByYearFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(ownDeceased, function(index, elem){
                                if(elem[0] == year){
                                    toChart.push(elem)
    
                                    return false
                                }
                            })
                            drawChartDeceasedByYear(toChart[0], 'DS')
                        }
                    })
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
    })
}

/**
 * Obtiene los datos para la sección de defunciones por año (día)
 */
function deceasedByYearDay(){
    $('#deceasedByYearDayBody').empty()

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'deceasedByYearDay'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data.length == 0){
                    $('#deceasedByYearDayBody').append('<tr><td><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#deceasedByYearDayBody').append( '   <tr class="text-center toBold">' +
                                                        '       <td>AÑO</td>' +
                                                        '       <td>LUNES</td>' +
                                                        '       <td>MARTES</td>' +
                                                        '       <td>MIÉRCOLES</td>' +
                                                        '       <td>JUEVES</td>' +
                                                        '       <td>VIERNES</td>' +
                                                        '       <td>SÁBADO</td>' +
                                                        '       <td>DOMINGO</td>' +
                                                        '       <td>TOTAL POR AÑO</td>' +
                                                        '   </tr>')

                    var totalMonday = 0
                    var totalTuesday = 0
                    var totalWednesday = 0
                    var totalThursday = 0
                    var totalFriday = 0
                    var totalSaturday = 0
                    var totalSunday = 0
                    var totalYears = 0
                    var dataToChart = []
                    $.each(data, function(year, info){
                        // Lunes
                        var dayMonday = 0
                        $.each(info.monday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    dayMonday++
                                    totalMonday++
                                }
                            }
                        })
    
                        // Martes
                        var dayTuesday = 0
                        $.each(info.tuesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    dayTuesday++
                                    totalTuesday++
                                }
                            }
                        })
    
                        // Miércoles
                        var dayWednesday = 0
                        $.each(info.wednesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    dayWednesday++
                                    totalWednesday++
                                }
                            }
                        })
    
                        // Jueves
                        var dayThursday = 0
                        $.each(info.thursday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    dayThursday++
                                    totalThursday++
                                }
                            }
                        })
    
                        // Viernes
                        var dayFriday = 0
                        $.each(info.friday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    dayFriday++
                                    totalFriday++
                                }
                            }
                        })
    
                        // Sábado
                        var daySaturday = 0
                        $.each(info.saturday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    daySaturday++
                                    totalSaturday++
                                }
                            }
                        })
    
                        // Domingo
                        var daySunday = 0
                        $.each(info.sunday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time > moment('8:00', 'HH:mm').format('X') && time < moment('21:59', 'HH:mm').format('X')){
                                    daySunday++
                                    totalSunday++
                                }
                            }
                        })
    
                        var total = dayMonday + dayTuesday + dayWednesday + dayThursday + dayFriday + daySaturday + daySunday
                        totalYears += total

                        dataToChart[year] = [
                            year,
                            dayMonday,
                            dayTuesday,
                            dayWednesday,
                            dayThursday,
                            dayFriday,
                            daySaturday,
                            daySunday,
                            total
                        ]
    
                        $('#deceasedByYearDayBody').append( '   <tr class="text-center">' +
                                                            '       <td>' + year + '</td>' +
                                                            '       <td>' + dayMonday + '</td>' +
                                                            '       <td>' + dayTuesday + '</td>' +
                                                            '       <td>' + dayWednesday + '</td>' +
                                                            '       <td>' + dayThursday + '</td>' +
                                                            '       <td>' + dayFriday + '</td>' +
                                                            '       <td>' + daySaturday + '</td>' +
                                                            '       <td>' + daySunday + '</td>' +
                                                            '       <td class="toBold">' + total + '</td>' +
                                                            '   </tr>')
                    })

                    $('#deceasedByYearDayBody').append( '   <tr class="text-center toBold">' +
                                                        '       <td>TOTAL POR DÍA DE SEMANA</td>' +
                                                        '       <td>' + totalMonday + '</td>' +
                                                        '       <td>' + totalTuesday + '</td>' +
                                                        '       <td>' + totalWednesday + '</td>' +
                                                        '       <td>' + totalThursday + '</td>' +
                                                        '       <td>' + totalFriday + '</td>' +
                                                        '       <td>' + totalSaturday + '</td>' +
                                                        '       <td>' + totalSunday + '</td>' +
                                                        '       <td>' + totalYears + '</td>' +
                                                        '   </tr>')

                    var year = $('#deceasedByYearDayChartYears').val()
                    if(year != null){
                        var toChart = []
                        $.each(dataToChart, function(index, elem){
                            if(index == year){
                                toChart.push(elem)
                                return false
                            }
                        })
                        drawChartDeceasedByYearDay(toChart[0])
                    }

                    $('#deceasedByYearDayChartYears').change(function(){
                        if(deceasedByYearDayFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(dataToChart, function(index, elem){
                                if(index == year){
                                    toChart.push(elem)
                                    return false
                                }
                            })
                            drawChartDeceasedByYearDay(toChart[0])
                        }
                    })
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
    })
}

/**
 * Obtiene los datos para la sección de defunciones por año (noche)
 */
function deceasedByYearNight(){
    $('#deceasedByYearNightBody').empty()

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'deceasedByYearNight'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data.length == 0){
                    $('#deceasedByYearNightBody').append('<tr><td><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#deceasedByYearNightBody').append( '   <tr class="text-center toBold">' +
                                                        '       <td>AÑO</td>' +
                                                        '       <td>LUNES</td>' +
                                                        '       <td>MARTES</td>' +
                                                        '       <td>MIÉRCOLES</td>' +
                                                        '       <td>JUEVES</td>' +
                                                        '       <td>VIERNES</td>' +
                                                        '       <td>SÁBADO</td>' +
                                                        '       <td>DOMINGO</td>' +
                                                        '       <td>TOTAL POR AÑO</td>' +
                                                        '   </tr>')

                    var totalMonday = 0
                    var totalTuesday = 0
                    var totalWednesday = 0
                    var totalThursday = 0
                    var totalFriday = 0
                    var totalSaturday = 0
                    var totalSunday = 0
                    var totalYears = 0
                    var dataToChart = []
                    $.each(data, function(year, info){
                        // Lunes
                        var nightMonday = 0
                        $.each(info.monday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightMonday++
                                    totalMonday++
                                }
                            }
                        })
    
                        // Martes
                        var nightTuesday = 0
                        $.each(info.tuesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightTuesday++
                                    totalTuesday++
                                }
                            }
                        })
    
                        // Miércoles
                        var nightWednesday = 0
                        $.each(info.wednesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightWednesday++
                                    totalWednesday++
                                }
                            }
                        })
    
                        // Jueves
                        var nightThursday = 0
                        $.each(info.thursday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightThursday++
                                    totalThursday++
                                }
                            }
                        })
    
                        // Viernes
                        var nightFriday = 0
                        $.each(info.friday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightFriday++
                                    totalFriday++
                                }
                            }
                        })
    
                        // Sábado
                        var nightSaturday = 0
                        $.each(info.saturday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightSaturday++
                                    totalSaturday++
                                }
                            }
                        })
    
                        // Domingo
                        var nightSunday = 0
                        $.each(info.sunday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                if(time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X')){
                                    nightSunday++
                                    totalSunday++
                                }
                            }
                        })
    
                        var total = nightMonday + nightTuesday + nightWednesday + nightThursday + nightFriday + nightSaturday + nightSunday
                        totalYears += total

                        dataToChart[year] = [
                            year,
                            nightMonday,
                            nightTuesday,
                            nightWednesday,
                            nightThursday,
                            nightFriday,
                            nightSaturday,
                            nightSunday,
                            total
                        ]
    
                        $('#deceasedByYearNightBody').append(   '   <tr class="text-center">' +
                                                                '       <td>' + year + '</td>' +
                                                                '       <td>' + nightMonday + '</td>' +
                                                                '       <td>' + nightTuesday + '</td>' +
                                                                '       <td>' + nightWednesday + '</td>' +
                                                                '       <td>' + nightThursday + '</td>' +
                                                                '       <td>' + nightFriday + '</td>' +
                                                                '       <td>' + nightSaturday + '</td>' +
                                                                '       <td>' + nightSunday + '</td>' +
                                                                '       <td class="toBold">' + total + '</td>' +
                                                                '   </tr>')
                    })

                    $('#deceasedByYearNightBody').append(   '   <tr class="text-center toBold">' +
                                                            '       <td>TOTAL POR DÍA DE SEMANA</td>' +
                                                            '       <td>' + totalMonday + '</td>' +
                                                            '       <td>' + totalTuesday + '</td>' +
                                                            '       <td>' + totalWednesday + '</td>' +
                                                            '       <td>' + totalThursday + '</td>' +
                                                            '       <td>' + totalFriday + '</td>' +
                                                            '       <td>' + totalSaturday + '</td>' +
                                                            '       <td>' + totalSunday + '</td>' +
                                                            '       <td>' + totalYears + '</td>' +
                                                            '   </tr>')

                    var year = $('#deceasedByYearNightChartYears').val()
                    if(year != null){
                        var toChart = []
                        $.each(dataToChart, function(index, elem){
                            if(index == year){
                                toChart.push(elem)
                                return false
                            }
                        })
                        drawChartDeceasedByYearNight(toChart[0])
                    }

                    $('#deceasedByYearNightChartYears').change(function(){
                        if(deceasedByYearNightFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(dataToChart, function(index, elem){
                                if(index == year){
                                    toChart.push(elem)
                                    return false
                                }
                            })
                            drawChartDeceasedByYearNight(toChart[0])
                        }
                    })
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
    })
}

/**
 * Obtiene los datos para la sección de día vs noche
 */
function dayvsnight(){
    $('#dayvsnightBody').empty()

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'dayvsnight'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data.length == 0){
                    $('#dayvsnightBody').append('<tr><td><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#dayvsnightBody').append('   <tr class="text-center toBold">' +
                                                '       <td>AÑO</td>' +
                                                '       <td>LUNES</td>' +
                                                '       <td>MARTES</td>' +
                                                '       <td>MIÉRCOLES</td>' +
                                                '       <td>JUEVES</td>' +
                                                '       <td>VIERNES</td>' +
                                                '       <td>SÁBADO</td>' +
                                                '       <td>DOMINGO</td>' +
                                                '       <td>PROMEDIO</td>' +
                                                '   </tr>')
                    
                    var totalMondayPercent = 0
                    var totalTuesdayPercent = 0
                    var totalWednesdayPercent = 0
                    var totalThursdayPercent = 0
                    var totalFridayPercent = 0
                    var totalSaturdaryPercent = 0
                    var totalSundayPercent = 0
                    var totalAveragePercent = 0
                    var dataToChart = []
                    $.each(data, function(year, info){
                        // Lunes
                        var dayMonday = 0
                        var nightMonday = 0
                        $.each(info.monday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightMonday++ : dayMonday++
                            }
                        })

                        var dayPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (dayMonday / (dayMonday + nightMonday) * 100).toFixed(2)
                        var nightPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (nightMonday / (dayMonday + nightMonday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalMonday').html(dayMonday + nightMonday)
                        $('#deceased-table #dayMonday').html(dayMonday)
                        $('#deceased-table #nightMonday').html(nightMonday)
                        $('#deceased-table #dayPercentMonday').html(dayPercentMonday + ' %')
                        $('#deceased-table #nightPercentMonday').html(nightPercentMonday + ' %')

                        // Martes
                        var dayTuesday = 0
                        var nightTuesday = 0
                        $.each(info.tuesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightTuesday++ : dayTuesday++
                            }
                        })

                        var dayPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (dayTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)
                        var nightPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (nightTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalTuesday').html(dayTuesday + nightTuesday)
                        $('#deceased-table #dayTuesday').html(dayTuesday)
                        $('#deceased-table #nightTuesday').html(nightTuesday)
                        $('#deceased-table #dayPercentTuesday').html(dayPercentTuesday + ' %')
                        $('#deceased-table #nightPercentTuesday').html(nightPercentTuesday + ' %')

                        // Miércoles
                        var dayWednesday = 0
                        var nightWednesday = 0
                        $.each(info.wednesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightWednesday++ : dayWednesday++
                            }
                        })

                        var dayPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (dayWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)
                        var nightPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (nightWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalWednesday').html(dayWednesday + nightWednesday)
                        $('#deceased-table #dayWednesday').html(dayWednesday)
                        $('#deceased-table #nightWednesday').html(nightWednesday)
                        $('#deceased-table #dayPercentWednesday').html(dayPercentWednesday + ' %')
                        $('#deceased-table #nightPercentWednesday').html(nightPercentWednesday + ' %')

                        // Jueves
                        var dayThursday = 0
                        var nightThursday = 0
                        $.each(info.thursday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightThursday++ : dayThursday++
                            }
                        })

                        var dayPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-' : (dayThursday / (dayThursday + nightThursday) * 100).toFixed(2)
                        var nightPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-': (nightThursday / (dayThursday + nightThursday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalThursday').html(dayThursday + nightThursday)
                        $('#deceased-table #dayThursday').html(dayThursday)
                        $('#deceased-table #nightThursday').html(nightThursday)
                        $('#deceased-table #dayPercentThursday').html(dayPercentThursday + ' %')
                        $('#deceased-table #nightPercentThursday').html(nightPercentThursday + ' %')

                        // Viernes
                        var dayFriday = 0
                        var nightFriday = 0
                        $.each(info.friday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightFriday++ : dayFriday++
                            }
                        })

                        var dayPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (dayFriday / (dayFriday + nightFriday) * 100).toFixed(2)
                        var nightPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (nightFriday / (dayFriday + nightFriday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalFriday').html(dayFriday + nightFriday)
                        $('#deceased-table #dayFriday').html(dayFriday)
                        $('#deceased-table #nightFriday').html(nightFriday)
                        $('#deceased-table #dayPercentFriday').html(dayPercentFriday + ' %')
                        $('#deceased-table #nightPercentFriday').html(nightPercentFriday + ' %')

                        // Sábado
                        var daySaturday = 0
                        var nightSaturday = 0
                        $.each(info.saturday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSaturday++ : daySaturday++
                            }
                        })

                        var dayPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (daySaturday / (daySaturday + nightSaturday) * 100).toFixed(2)
                        var nightPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (nightSaturday / (daySaturday + nightSaturday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalSaturday').html(daySaturday + nightSaturday)
                        $('#deceased-table #daySaturday').html(daySaturday)
                        $('#deceased-table #nightSaturday').html(nightSaturday)
                        $('#deceased-table #dayPercentSaturday').html(dayPercentSaturday + ' %')
                        $('#deceased-table #nightPercentSaturday').html(nightPercentSaturday + ' %')

                        // Domingo
                        var daySunday = 0
                        var nightSunday = 0
                        $.each(info.sunday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSunday++ : daySunday++
                            }
                        })

                        var dayPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (daySunday / (daySunday + nightSunday) * 100).toFixed(2)
                        var nightPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (nightSunday / (daySunday + nightSunday) * 100).toFixed(2)

                        var dayPercentAverage = 0
                        
                        dayPercentAverage += dayPercentMonday == '' ? 0 : dayMonday / (dayMonday + nightMonday) * 100
                        dayPercentAverage += dayPercentTuesday == '' ? 0 : dayTuesday / (dayTuesday + nightTuesday) * 100
                        dayPercentAverage += dayPercentWednesday == '' ? 0 : dayWednesday / (dayWednesday + nightWednesday) * 100
                        dayPercentAverage += dayPercentThursday == '' ? 0 : dayThursday / (dayThursday + nightThursday) * 100
                        dayPercentAverage += dayPercentFriday == '' ? 0 : dayFriday / (dayFriday + nightFriday) * 100
                        dayPercentAverage += dayPercentSaturday == '' ? 0 : daySaturday / (daySaturday + nightSaturday) * 100
                        dayPercentAverage += dayPercentSunday == '' ? 0 : daySunday / (daySunday + nightSunday) * 100

                        dayPercentAverage = (dayPercentAverage / 7).toFixed(2)

                        totalMondayPercent += dayPercentMonday == '' ? 0 : dayMonday / (dayMonday + nightMonday) * 100
                        totalTuesdayPercent += dayPercentTuesday == '' ? 0 : dayTuesday / (dayTuesday + nightTuesday) * 100
                        totalWednesdayPercent += dayPercentWednesday == '' ? 0 : dayWednesday / (dayWednesday + nightWednesday) * 100
                        totalThursdayPercent += dayPercentThursday == '' ? 0 : dayThursday / (dayThursday + nightThursday) * 100
                        totalFridayPercent += dayPercentFriday == '' ? 0 : dayFriday / (dayFriday + nightFriday) * 100
                        totalSaturdaryPercent += dayPercentSaturday == '' ? 0 : daySaturday / (daySaturday + nightSaturday) * 100
                        totalSundayPercent += dayPercentSunday == '' ? 0 : daySunday / (daySunday + nightSunday) * 100

                        totalAveragePercent += dayPercentMonday == '' ? 0 : dayMonday / (dayMonday + nightMonday) * 100
                        totalAveragePercent += dayPercentTuesday == '' ? 0 : dayTuesday / (dayTuesday + nightTuesday) * 100
                        totalAveragePercent += dayPercentWednesday == '' ? 0 : dayWednesday / (dayWednesday + nightWednesday) * 100
                        totalAveragePercent += dayPercentThursday == '' ? 0 : dayThursday / (dayThursday + nightThursday) * 100
                        totalAveragePercent += dayPercentFriday == '' ? 0 : dayFriday / (dayFriday + nightFriday) * 100
                        totalAveragePercent += dayPercentSaturday == '' ? 0 : daySaturday / (daySaturday + nightSaturday) * 100
                        totalAveragePercent += dayPercentSunday == '' ? 0 : daySunday / (daySunday + nightSunday) * 100

                        dataToChart[year] = [
                            [year],
                            [(parseFloat(dayPercentMonday)).toFixed(2), (100 - parseFloat(dayPercentMonday)).toFixed(2)],
                            [(parseFloat(dayPercentTuesday)).toFixed(2), (100 - parseFloat(dayPercentTuesday)).toFixed(2)],
                            [(parseFloat(dayPercentWednesday)).toFixed(2), (100 - parseFloat(dayPercentWednesday)).toFixed(2)],
                            [(parseFloat(dayPercentThursday)).toFixed(2), (100 - parseFloat(dayPercentThursday)).toFixed(2)],
                            [(parseFloat(dayPercentFriday)).toFixed(2), (100 - parseFloat(dayPercentFriday)).toFixed(2)],
                            [(parseFloat(dayPercentSaturday)).toFixed(2), (100 - parseFloat(dayPercentSaturday)).toFixed(2)],
                            [(parseFloat(dayPercentSunday)).toFixed(2), (100 - parseFloat(dayPercentSunday)).toFixed(2)],
                            [(parseFloat(dayPercentAverage)).toFixed(2), (100 - parseFloat(dayPercentAverage)).toFixed(2)],
                        ]

                        $('#dayvsnightBody').append('   <tr class="text-center">' +
                                                    '       <td>' + year + '</td>' +
                                                    '       <td>' + dayPercentMonday + ' %</td>' +
                                                    '       <td>' + dayPercentTuesday + ' %</td>' +
                                                    '       <td>' + dayPercentWednesday + ' %</td>' +
                                                    '       <td>' + dayPercentThursday + ' %</td>' +
                                                    '       <td>' + dayPercentFriday + ' %</td>' +
                                                    '       <td>' + dayPercentSaturday + ' %</td>' +
                                                    '       <td>' + dayPercentSunday + ' %</td>' +
                                                    '       <td class="toBold">' + dayPercentAverage + ' %</td>' +
                                                    '   </tr>')
                    })

                    totalMondayPercent = (totalMondayPercent / Object.keys(data).length).toFixed(2)
                    totalTuesdayPercent = (totalTuesdayPercent / Object.keys(data).length).toFixed(2)
                    totalWednesdayPercent = (totalWednesdayPercent / Object.keys(data).length).toFixed(2)
                    totalThursdayPercent = (totalThursdayPercent / Object.keys(data).length).toFixed(2)
                    totalFridayPercent = (totalFridayPercent / Object.keys(data).length).toFixed(2)
                    totalSaturdaryPercent = (totalSaturdaryPercent / Object.keys(data).length).toFixed(2)
                    totalSundayPercent = (totalSundayPercent / Object.keys(data).length).toFixed(2)
                    totalAveragePercent = (totalAveragePercent / (Object.keys(data).length * 7)).toFixed(2)
                    
                    $('#dayvsnightBody').append('   <tr class="text-center toBold">' +
                                                '       <td>PROMEDIO DE FALLECIDO POR DÍA</td>' +
                                                '       <td>' + totalMondayPercent + ' %</td>' +
                                                '       <td>' + totalTuesdayPercent + ' %</td>' +
                                                '       <td>' + totalWednesdayPercent + ' %</td>' +
                                                '       <td>' + totalThursdayPercent + ' %</td>' +
                                                '       <td>' + totalFridayPercent + ' %</td>' +
                                                '       <td>' + totalSaturdaryPercent + ' %</td>' +
                                                '       <td>' + totalSundayPercent + ' %</td>' +
                                                '       <td>' + totalAveragePercent + ' %</td>' +
                                                '   </tr>')

                    var year = $('#dayvsnightChartYears').val()
                    if(year != null){
                        var toChart = []

                        $.each(dataToChart, function(index, elem){
                            if(index == year){
                                toChart.push(elem)
                                return false
                            }
                        })
                        drawChartDayvsnight(toChart[0])
                    }

                    $('#dayvsnightChartYears').change(function(){
                        if(deceasedByYearNightFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(dataToChart, function(index, elem){
                                if(index == year){
                                    toChart.push(elem)
                                    return false
                                }
                            })
                            drawChartDayvsnight(toChart[0])
                        }
                    })
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
    })
}

/**
 * Obtiene los datos para la sección de noche vs día
 */
function nightvsday(){
    $('#nightvsdayBody').empty()

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'nightvsday'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data.length == 0){
                    $('#nightvsdayBody').append('<tr><td><div class="alert alert-warning">No hay datos para mostrar en esta tabla</div></td></tr>')
                }else{
                    $('#nightvsdayBody').append('   <tr class="text-center toBold">' +
                                                '       <td>AÑO</td>' +
                                                '       <td>LUNES</td>' +
                                                '       <td>MARTES</td>' +
                                                '       <td>MIÉRCOLES</td>' +
                                                '       <td>JUEVES</td>' +
                                                '       <td>VIERNES</td>' +
                                                '       <td>SÁBADO</td>' +
                                                '       <td>DOMINGO</td>' +
                                                '       <td>PROMEDIO</td>' +
                                                '   </tr>')
                    
                    var totalMondayPercent = 0
                    var totalTuesdayPercent = 0
                    var totalWednesdayPercent = 0
                    var totalThursdayPercent = 0
                    var totalFridayPercent = 0
                    var totalSaturdaryPercent = 0
                    var totalSundayPercent = 0
                    var totalAveragePercent = 0
                    var dataToChart = []
                    $.each(data, function(year, info){
                        // Lunes
                        var dayMonday = 0
                        var nightMonday = 0
                        $.each(info.monday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightMonday++ : dayMonday++
                            }
                        })

                        var dayPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (dayMonday / (dayMonday + nightMonday) * 100).toFixed(2)
                        var nightPercentMonday = dayMonday == 0 && nightMonday == 0 ? '-' : (nightMonday / (dayMonday + nightMonday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalMonday').html(dayMonday + nightMonday)
                        $('#deceased-table #dayMonday').html(dayMonday)
                        $('#deceased-table #nightMonday').html(nightMonday)
                        $('#deceased-table #dayPercentMonday').html(dayPercentMonday + ' %')
                        $('#deceased-table #nightPercentMonday').html(nightPercentMonday + ' %')

                        // Martes
                        var dayTuesday = 0
                        var nightTuesday = 0
                        $.each(info.tuesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightTuesday++ : dayTuesday++
                            }
                        })

                        var dayPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (dayTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)
                        var nightPercentTuesday = dayTuesday == 0 && nightTuesday == 0 ? '-' : (nightTuesday / (dayTuesday + nightTuesday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalTuesday').html(dayTuesday + nightTuesday)
                        $('#deceased-table #dayTuesday').html(dayTuesday)
                        $('#deceased-table #nightTuesday').html(nightTuesday)
                        $('#deceased-table #dayPercentTuesday').html(dayPercentTuesday + ' %')
                        $('#deceased-table #nightPercentTuesday').html(nightPercentTuesday + ' %')

                        // Miércoles
                        var dayWednesday = 0
                        var nightWednesday = 0
                        $.each(info.wednesday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightWednesday++ : dayWednesday++
                            }
                        })

                        var dayPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (dayWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)
                        var nightPercentWednesday = dayWednesday == 0 && nightWednesday == 0 ? '-' : (nightWednesday / (dayWednesday + nightWednesday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalWednesday').html(dayWednesday + nightWednesday)
                        $('#deceased-table #dayWednesday').html(dayWednesday)
                        $('#deceased-table #nightWednesday').html(nightWednesday)
                        $('#deceased-table #dayPercentWednesday').html(dayPercentWednesday + ' %')
                        $('#deceased-table #nightPercentWednesday').html(nightPercentWednesday + ' %')

                        // Jueves
                        var dayThursday = 0
                        var nightThursday = 0
                        $.each(info.thursday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightThursday++ : dayThursday++
                            }
                        })

                        var dayPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-' : (dayThursday / (dayThursday + nightThursday) * 100).toFixed(2)
                        var nightPercentThursday = dayThursday == 0 && nightThursday == 0 ? '-': (nightThursday / (dayThursday + nightThursday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalThursday').html(dayThursday + nightThursday)
                        $('#deceased-table #dayThursday').html(dayThursday)
                        $('#deceased-table #nightThursday').html(nightThursday)
                        $('#deceased-table #dayPercentThursday').html(dayPercentThursday + ' %')
                        $('#deceased-table #nightPercentThursday').html(nightPercentThursday + ' %')

                        // Viernes
                        var dayFriday = 0
                        var nightFriday = 0
                        $.each(info.friday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightFriday++ : dayFriday++
                            }
                        })

                        var dayPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (dayFriday / (dayFriday + nightFriday) * 100).toFixed(2)
                        var nightPercentFriday = dayFriday == 0 && nightFriday == 0 ? '-' : (nightFriday / (dayFriday + nightFriday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalFriday').html(dayFriday + nightFriday)
                        $('#deceased-table #dayFriday').html(dayFriday)
                        $('#deceased-table #nightFriday').html(nightFriday)
                        $('#deceased-table #dayPercentFriday').html(dayPercentFriday + ' %')
                        $('#deceased-table #nightPercentFriday').html(nightPercentFriday + ' %')

                        // Sábado
                        var daySaturday = 0
                        var nightSaturday = 0
                        $.each(info.saturday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSaturday++ : daySaturday++
                            }
                        })

                        var dayPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (daySaturday / (daySaturday + nightSaturday) * 100).toFixed(2)
                        var nightPercentSaturday = daySaturday == 0 && nightSaturday == 0 ? '-' : (nightSaturday / (daySaturday + nightSaturday) * 100).toFixed(2)

                        $('#deceased-table #dayTotalSaturday').html(daySaturday + nightSaturday)
                        $('#deceased-table #daySaturday').html(daySaturday)
                        $('#deceased-table #nightSaturday').html(nightSaturday)
                        $('#deceased-table #dayPercentSaturday').html(dayPercentSaturday + ' %')
                        $('#deceased-table #nightPercentSaturday').html(nightPercentSaturday + ' %')

                        // Domingo
                        var daySunday = 0
                        var nightSunday = 0
                        $.each(info.sunday, function(index, elem){
                            if(elem.requestTime != null){
                                var time = moment(elem.requestTime, 'HH:mm').format('X')
                                time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? nightSunday++ : daySunday++
                            }
                        })

                        var dayPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (daySunday / (daySunday + nightSunday) * 100).toFixed(2)
                        var nightPercentSunday = daySunday == 0 && nightSunday == 0 ? '-' : (nightSunday / (daySunday + nightSunday) * 100).toFixed(2)

                        var nightPercentAverage = 0
                        
                        nightPercentAverage += nightPercentMonday == '' ? 0 : nightMonday / (dayMonday + nightMonday) * 100
                        nightPercentAverage += nightPercentTuesday == '' ? 0 : nightTuesday / (dayTuesday + nightTuesday) * 100
                        nightPercentAverage += nightPercentWednesday == '' ? 0 : nightWednesday / (dayWednesday + nightWednesday) * 100
                        nightPercentAverage += nightPercentThursday == '' ? 0 : nightThursday / (dayThursday + nightThursday) * 100
                        nightPercentAverage += nightPercentFriday == '' ? 0 : nightFriday / (dayFriday + nightFriday) * 100
                        nightPercentAverage += nightPercentSaturday == '' ? 0 : nightSaturday / (daySaturday + nightSaturday) * 100
                        nightPercentAverage += nightPercentSunday == '' ? 0 : nightSunday / (daySunday + nightSunday) * 100

                        nightPercentAverage = (nightPercentAverage / 7).toFixed(2)

                        totalMondayPercent += nightPercentMonday == '' ? 0 : nightMonday / (dayMonday + nightMonday) * 100
                        totalTuesdayPercent += nightPercentTuesday == '' ? 0 : nightTuesday / (dayTuesday + nightTuesday) * 100
                        totalWednesdayPercent += nightPercentWednesday == '' ? 0 : nightWednesday / (dayWednesday + nightWednesday) * 100
                        totalThursdayPercent += nightPercentThursday == '' ? 0 : nightThursday / (dayThursday + nightThursday) * 100
                        totalFridayPercent += nightPercentFriday == '' ? 0 : nightFriday / (dayFriday + nightFriday) * 100
                        totalSaturdaryPercent += nightPercentSaturday == '' ? 0 : nightSaturday / (daySaturday + nightSaturday) * 100
                        totalSundayPercent += nightPercentSunday == '' ? 0 : nightSunday / (daySunday + nightSunday) * 100

                        totalAveragePercent += nightPercentMonday == '' ? 0 : nightMonday / (dayMonday + nightMonday) * 100
                        totalAveragePercent += nightPercentTuesday == '' ? 0 : nightTuesday / (dayTuesday + nightTuesday) * 100
                        totalAveragePercent += nightPercentWednesday == '' ? 0 : nightWednesday / (dayWednesday + nightWednesday) * 100
                        totalAveragePercent += nightPercentThursday == '' ? 0 : nightThursday / (dayThursday + nightThursday) * 100
                        totalAveragePercent += nightPercentFriday == '' ? 0 : nightFriday / (dayFriday + nightFriday) * 100
                        totalAveragePercent += nightPercentSaturday == '' ? 0 : nightSaturday / (daySaturday + nightSaturday) * 100
                        totalAveragePercent += nightPercentSunday == '' ? 0 : nightSunday / (daySunday + nightSunday) * 100

                        dataToChart[year] = [
                            [year],
                            [(100 - parseFloat(nightPercentMonday)).toFixed(2), (parseFloat(nightPercentMonday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentTuesday)).toFixed(2), (parseFloat(nightPercentTuesday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentWednesday)).toFixed(2), (parseFloat(nightPercentWednesday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentThursday)).toFixed(2), (parseFloat(nightPercentThursday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentFriday)).toFixed(2), (parseFloat(nightPercentFriday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentSaturday)).toFixed(2), (parseFloat(nightPercentSaturday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentSunday)).toFixed(2), (parseFloat(nightPercentSunday)).toFixed(2)],
                            [(100 - parseFloat(nightPercentAverage)).toFixed(2), (parseFloat(nightPercentAverage)).toFixed(2)],
                        ]

                        $('#nightvsdayBody').append('   <tr class="text-center">' +
                                                    '       <td>' + year + '</td>' +
                                                    '       <td>' + nightPercentMonday + ' %</td>' +
                                                    '       <td>' + nightPercentTuesday + ' %</td>' +
                                                    '       <td>' + nightPercentWednesday + ' %</td>' +
                                                    '       <td>' + nightPercentThursday + ' %</td>' +
                                                    '       <td>' + nightPercentFriday + ' %</td>' +
                                                    '       <td>' + nightPercentSaturday + ' %</td>' +
                                                    '       <td>' + nightPercentSunday + ' %</td>' +
                                                    '       <td class="toBold">' + nightPercentAverage + ' %</td>' +
                                                    '   </tr>')
                    })

                    totalMondayPercent = (totalMondayPercent / Object.keys(data).length).toFixed(2)
                    totalTuesdayPercent = (totalTuesdayPercent / Object.keys(data).length).toFixed(2)
                    totalWednesdayPercent = (totalWednesdayPercent / Object.keys(data).length).toFixed(2)
                    totalThursdayPercent = (totalThursdayPercent / Object.keys(data).length).toFixed(2)
                    totalFridayPercent = (totalFridayPercent / Object.keys(data).length).toFixed(2)
                    totalSaturdaryPercent = (totalSaturdaryPercent / Object.keys(data).length).toFixed(2)
                    totalSundayPercent = (totalSundayPercent / Object.keys(data).length).toFixed(2)
                    totalAveragePercent = (totalAveragePercent / (Object.keys(data).length * 7)).toFixed(2)
                    
                    $('#nightvsdayBody').append('   <tr class="text-center toBold">' +
                                                '       <td>PROMEDIO DE FALLECIDO POR NOCHE</td>' +
                                                '       <td>' + totalMondayPercent + ' %</td>' +
                                                '       <td>' + totalTuesdayPercent + ' %</td>' +
                                                '       <td>' + totalWednesdayPercent + ' %</td>' +
                                                '       <td>' + totalThursdayPercent + ' %</td>' +
                                                '       <td>' + totalFridayPercent + ' %</td>' +
                                                '       <td>' + totalSaturdaryPercent + ' %</td>' +
                                                '       <td>' + totalSundayPercent + ' %</td>' +
                                                '       <td>' + totalAveragePercent + ' %</td>' +
                                                '   </tr>')

                    var year = $('#nightvsdayChartYears').val()
                    if(year != null){
                        var toChart = []
                        $.each(dataToChart, function(index, elem){
                            if(index == year){
                                toChart.push(elem)
                                return false
                            }
                        })
                        drawChartNightvsday(toChart[0])
                    }

                    $('#nightvsdayChartYears').change(function(){
                        if(deceasedByYearNightFlag){
                            var year = $(this).val()
                            var toChart = []
                            $.each(dataToChart, function(index, elem){
                                if(index == year){
                                    toChart.push(elem)
                                    return false
                                }
                            })
                            drawChartNightvsday(toChart[0])
                        }
                    })
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
    })
}

/**
 * Obtiene los datos para la sección de crematorios
 */
function getCrematorium(){
    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getCrematoriums',
            data: $("#allCrematoriums").val()
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                $('#crematoriumsBody').empty()

                if(data.length > 0){
                    var totalServices = 0
                    var totalCremations = 0
                    $.each(data, function(index, elem){
                        var year = parseInt(elem[0])
                        var services = parseInt(elem[1])
                        var cremations = parseInt(elem[2])

                        var percent = 0.00;
                        if(services > 0){
                            percent = (cremations / services * 100).toFixed(2)
                        }
    
                        totalServices += services
                        totalCremations += cremations
    
                        $('#crematoriumsBody').append(  
                            '   <tr class="text-center">' +
                            '       <td>' + year + '</td>' +
                            '       <td>' + services + '</td>' +
                            '       <td>' + cremations + '</td>' +
                            '       <td>' + percent + ' %</td>' +
                            '   </tr>'
                        );
                    })
    
                    var totalPercent = 0.00;
                    if(totalServices > 0){
                        var totalPercent = (totalCremations / totalServices * 100).toFixed(2)
                    }
                    $('#crematoriumsBody').append(  
                        '   <tr class="text-center toBold">' +
                        '       <td>Total</td>' +
                        '       <td>' + totalServices + '</td>' +
                        '       <td>' + totalCremations + '</td>' +
                        '       <td>' + totalPercent + ' %</td>' +
                        '   </tr>'
                    )
                }else{
                    $('#crematoriumsBody').append('<td colspan="4">No se han encontrado resultados</t>')
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
    })
}

/**
 * Obtiene los datos para la sección de crematorios (servicios propios)
 */
function getCrematoriumOwnService(){

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getCrematoriumsOwnServices',
            data: $('#Owncrematoriums').val()
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                $('#crematoriumsOwnServiceBody').empty()

                if(data.length > 0){
                    var totalServices = 0
                    var totalCremations = 0
                    $.each(data, function(index, elem){
                        var year = parseInt(elem[0])
                        var services = parseInt(elem[1])
                        var cremations = parseInt(elem[2])
                       
                        var percent = 0.00;
                        if(services > 0){
                            percent = (cremations / services * 100).toFixed(2)
                        }
    
                        totalServices += services
                        totalCremations += cremations
    
                        $('#crematoriumsOwnServiceBody').append(  
                            '   <tr class="text-center">' +
                            '       <td>' + year + '</td>' +
                            '       <td>' + services + '</td>' +
                            '       <td>' + cremations + '</td>' +
                            '       <td>' + percent + ' %</td>' +
                            '   </tr>')
                    })
    
                    var totalPercent = 0.00;
                    if(totalServices > 0){
                        totalPercent = (totalCremations / totalServices * 100).toFixed(2)
                    }
                    $('#crematoriumsOwnServiceBody').append(  
                        '   <tr class="text-center toBold">' +
                        '       <td>Total</td>' +
                        '       <td>' + totalServices + '</td>' +
                        '       <td>' + totalCremations + '</td>' +
                        '       <td>' + totalPercent + ' %</td>' +
                        '   </tr>'
                    );
                }else{
                    $('#crematoriumsOutServiceBody').append('<td colspan="4">No se han encontrado resultados</t>')
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
    })
}

/**
 * Obtiene los datos para la sección de crematorios (servicios propios)
 */
function getCrematoriumOutService(){

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getCrematoriumsOutServices',
            data: $('#Outcrematoriums').val()
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                $('#crematoriumsOutServiceBody').empty()

                if(data.length > 0){
                    var totalServices = 0
                    var totalCremations = 0
                    $.each(data, function(index, elem){
                        var year = parseInt(elem[0])
                        var services = parseInt(elem[1])
                        var cremations = parseInt(elem[2])

                        var percent = 0.00;
                        if(services > 0){
                            percent = (cremations / services * 100).toFixed(2)
                        }
    
                        totalServices += services
                        totalCremations += cremations
    
                        $('#crematoriumsOutServiceBody').append(  
                            '   <tr class="text-center">' +
                            '       <td>' + year + '</td>' +
                            '       <td>' + services + '</td>' +
                            '       <td>' + cremations + '</td>' +
                            '       <td>' + percent + ' %</td>' +
                            '   </tr>')
                    })
    
                    var totalPercent = 0.00;
                    if(totalServices > 0){
                        totalPercent = (totalCremations / totalServices * 100).toFixed(2)
                    }

                    $('#crematoriumsOutServiceBody').append(  
                        '   <tr class="text-center toBold">' +
                        '       <td>Total</td>' +
                        '       <td>' + totalServices + '</td>' +
                        '       <td>' + totalCremations + '</td>' +
                        '       <td>' + totalPercent + ' %</td>' +
                        '   </tr>')
                }else{
                    $('#crematoriumsOutServiceBody').append('<td colspan="4">No se han encontrado resultados</t>')
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
    })
}

/**
 * Obtiene los datos para la sección de cremaciones
 */
function getCrematoriumsMonthsDays(){

    var yearCremations = $("#yearCremations").val();
    var monthCremations = null;
    if($("#monthCremations").val() != null && $("#monthCremations").val() != '0'){
        monthCremations = $("#monthCremations").val();
    }

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getCrematoriumsMonthsDays',
            year: yearCremations,
            month: monthCremations
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                $('#crematoriumsMonthDayBody').empty();

                if(data.length > 0){

                    var cremationsDaysCount = new Array;
                    for (i=1; i<32; i++){
                        cremationsDaysCount[i] = 0;
                    }
    
                    var currentMonth = moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('MM');
                    $.each(data, function(index, elem){
                        if(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('MM') != currentMonth){

                            var totalDaysMonth = moment('01/'+currentMonth+'/'+moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY'), 'DD/MM/YYYY').daysInMonth();
                            var daysRows = '';
                            var totalServices = 0;
                            var totalWithCremation = 0;
                            var totalWithoutCremation = 0;
                            for (i=1; i<cremationsDaysCount.length; i++){

                                if(i > 28 && i > totalDaysMonth){
                                    daysRows += '<td> - </td>';
                                }else{
                                    daysRows += '<td>'+cremationsDaysCount[i]+'</td>';
                                }
                                
                                if(cremationsDaysCount[i] == 0){
                                    totalWithoutCremation ++;
                                }else{
                                    totalWithCremation++;
                                    totalServices += parseInt(cremationsDaysCount[i]);
                                }

                                cremationsDaysCount[i] = 0;
                            }

                            // Checks total month days
                           
                            var monthDiffDays = 31 - parseInt(totalDaysMonth);
                            totalWithoutCremation -= monthDiffDays;

                            daysRows = 
                                '<tr class="text-center">'+
                                '   <td>'+moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY')+'</td>'+
                                '   <td>'+months[parseInt(currentMonth)]+'</td>'+
                                    daysRows +
                                '   <td>'+totalServices+'</td>'+
                                '   <td>'+totalWithCremation+'</td>'+
                                '   <td>'+totalWithoutCremation+'</td>'+
                                '</tr>';

                            $('#crematoriumsMonthDayBody').append(daysRows);

                            currentMonth = moment(elem.date, 'YYYY-MM-DD').format('MM');
                        }

                        cremationsDaysCount[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('DD'))] += 1;
                    })

                    // Draws last month
                    var totalDaysMonth = moment('01/'+currentMonth+'/'+moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('YYYY'), 'DD/MM/YYYY').daysInMonth();
                    var daysRows = '';
                    var totalServices = 0;
                    var totalWithCremation = 0;
                    var totalWithoutCremation = 0;
                    for (i=1; i<cremationsDaysCount.length; i++){

                        if(i > 28 && i > totalDaysMonth){
                            daysRows += '<td> - </td>';
                        }else if(
                            parseInt(moment().format('YYYY')) == moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('YYYY') &&
                            parseInt(moment().format('MM')) == parseInt(currentMonth) &&
                            parseInt(moment().format('DD')) <= i
                        ){
                            daysRows += '<td> - </td>';
                        }else{
                            daysRows += '<td>'+cremationsDaysCount[i]+'</td>';
                            if(cremationsDaysCount[i] == 0){
                                totalWithoutCremation++;
                            }
                        }

                        if(cremationsDaysCount[i] != 0){
                            totalWithCremation++;
                            totalServices += parseInt(cremationsDaysCount[i]);
                        }
                    }

                    daysRows = 
                        '<tr class="text-center">'+
                        '   <td>'+moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('YYYY')+'</td>'+
                        '   <td>'+months[parseInt(currentMonth)]+'</td>'+
                            daysRows +
                        '   <td>'+totalServices+'</td>'+
                        '   <td>'+totalWithCremation+'</td>'+
                        '   <td>'+totalWithoutCremation+'</td>'+
                        '</tr>';

                    $('#crematoriumsMonthDayBody').append(daysRows);

                }else{
                    $('#crematoriumsMonthDayBody').append('<td colspan="36">No se han encontrado resultados</t>')
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
    })
}

/**
 * Obtiene los datos para la sección de cremaciones
 */
function getCrematoriumsDaysWeek(){

    var yearCremations = $("#yearCremationsWeek").val();
    var monthCremations = null;
    if($("#monthCremationsWeek").val() != null && $("#monthCremationsWeek").val() != '0'){
        monthCremations = $("#monthCremationsWeek").val();
    }

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getCrematoriumsMonthsDays',
            year: yearCremations,
            month: monthCremations
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                $('#crematoriumsDaysWeekBody').empty();

                if(data.length > 0){

                    var totalDaysWeek = new Array;
                    var totalDaysMorningWeek = new Array;
                    var totalDaysNightWeek = new Array;
                    for (i=1; i<8; i++){
                        totalDaysWeek[i] = 0;
                        totalDaysMorningWeek[i] = 0;
                        totalDaysNightWeek[i] = 0;
                    }
    
                    $.each(data, function(index, elem){

                        totalDaysWeek[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').isoWeekday())] += 1;
                        
                        var limitInitTime = moment( moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' 07:30:00', 'YYYY-MM-DD HH:mm:ss').format('X');
                        var limitEndTime = moment(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' 21:59:59', 'YYYY-MM-DD HH:mm:ss').format('X');

                        if(
                            moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('X') >= limitInitTime && 
                            moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('X') <= limitEndTime
                        ){
                            totalDaysMorningWeek[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').isoWeekday())] += 1;
                        }else{

                            totalDaysNightWeek[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').isoWeekday())] += 1;
                        }
                    })

                    var trDays = '<tr class="text-center"><td><strong>Total</strong></td>';
                    var trMorning = '<tr class="text-center"><td><strong>Día</strong></td>';
                    var trNight = '<tr class="text-center"><td><strong>Noche</strong></td>';
                    for (i=1; i<8; i++){
                        trDays += '<td>'+totalDaysWeek[i]+'</td>';
                        trMorning += '<td>'+totalDaysMorningWeek[i]+'</td>';
                        trNight += '<td>'+totalDaysNightWeek[i]+'</td>';
                    }
                    trDays +='</tr>'
                    trMorning +='</tr>'
                    trNight +='</tr>'

                    $('#crematoriumsDaysWeekBody').append(trDays);
                    $('#crematoriumsDaysWeekBody').append(trMorning);
                    $('#crematoriumsDaysWeekBody').append(trNight);
                }else{
                    $('#crematoriumsDaysWeekBody').append('<td colspan="8">No se han encontrado resultados</t>')
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
    })
}

/**
 * Obtiene los datos para la sección de judiciales
 */
function getJudicialesMonthsDays(){

    var yearJudiciales = $("#yearJudiciales").val();
    var monthJudiciales = null;
    if($("#monthJudiciales").val() != null && $("#monthJudiciales").val() != '0'){
        monthJudiciales = $("#monthJudiciales").val();
    }

    var departureJudiciales = 0;
    if($("#departureJudiciales").prop('checked')){
        departureJudiciales = 1;
    }

    var returnJudiciales = 0;
    if($("#returnJudiciales").prop('checked')){
        returnJudiciales = 1;
    }

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getJudicialesMonthsDays',
            year: yearJudiciales,
            month: monthJudiciales,
            departure: departureJudiciales,
            return: returnJudiciales

        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                $('#judicialesMonthDayBody').empty();

                if(data.length > 0){

                    var judicialesDaysCount = new Array;
                    for (i=1; i<32; i++){
                        judicialesDaysCount[i] = 0;
                    }
    
                    var currentMonth = moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('MM');
                    $.each(data, function(index, elem){
                        if(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('MM') != currentMonth){

                            var totalDaysMonth = moment('01/'+currentMonth+'/'+moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY'), 'DD/MM/YYYY').daysInMonth();
                            var daysRows = '';
                            var totalServices = 0;
                            var totalWithJudicial = 0;
                            var totalWithoutJudicial = 0;
                            for (i=1; i<judicialesDaysCount.length; i++){

                                if(i > 28 && i > totalDaysMonth){
                                    daysRows += '<td> - </td>';
                                }else{
                                    daysRows += '<td>'+judicialesDaysCount[i]+'</td>';
                                }
                                
                                if(judicialesDaysCount[i] == 0){
                                    totalWithoutJudicial ++;
                                }else{
                                    totalWithJudicial++;
                                    totalServices += parseInt(judicialesDaysCount[i]);
                                }

                                judicialesDaysCount[i] = 0;
                            }

                            // Checks total month days
                            var monthDiffDays = 31 - parseInt(totalDaysMonth);
                            totalWithoutJudicial -= monthDiffDays;

                            daysRows = 
                                '<tr class="text-center">'+
                                '   <td>'+moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY')+'</td>'+
                                '   <td>'+months[parseInt(currentMonth)]+'</td>'+
                                    daysRows +
                                '   <td>'+totalServices+'</td>'+
                                '   <td>'+totalWithJudicial+'</td>'+
                                '   <td>'+totalWithoutJudicial+'</td>'+
                                '</tr>';

                            $('#judicialesMonthDayBody').append(daysRows);

                            currentMonth = moment(elem.date, 'YYYY-MM-DD').format('MM');
                        }

                        judicialesDaysCount[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('DD'))] += 1;
                    })

                    // Draws last month
                    var totalDaysMonth = moment('01/'+currentMonth+'/'+moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('YYYY'), 'DD/MM/YYYY').daysInMonth();
                    var daysRows = '';
                    var totalServices = 0;
                    var totalWithJudicial = 0;
                    var totalWithoutJudicial = 0;
                    var futureDays = 0;
                    for (i=1; i<judicialesDaysCount.length; i++){

                        if(i > 28 && i > totalDaysMonth){
                            daysRows += '<td> - </td>';
                        }else if(
                            parseInt(moment().format('MM')) == parseInt(currentMonth) &&
                            parseInt(moment().format('DD')) <= i
                        ){
                            daysRows += '<td> - </td>';
                            futureDays++;
                        }else{
                            daysRows += '<td>'+judicialesDaysCount[i]+'</td>';
                        }

                        if(judicialesDaysCount[i] == 0){
                            totalWithoutJudicial ++;
                        }else{
                            totalWithJudicial++;
                            totalServices += parseInt(judicialesDaysCount[i]);
                        }
                    }

                    // Checks total month days
                    var monthDiffDays = 31 - parseInt(totalDaysMonth);
                    totalWithoutJudicial -= monthDiffDays;
                    totalWithoutJudicial -= futureDays;

                    daysRows = 
                        '<tr class="text-center">'+
                        '   <td>'+moment(data[0].date, 'YYYY-MM-DD HH:mm:ss').format('YYYY')+'</td>'+
                        '   <td>'+months[parseInt(currentMonth)]+'</td>'+
                            daysRows +
                        '   <td>'+totalServices+'</td>'+
                        '   <td>'+totalWithJudicial+'</td>'+
                        '   <td>'+totalWithoutJudicial+'</td>'+
                        '</tr>';

                    $('#judicialesMonthDayBody').append(daysRows);

                }else{
                    $('#judicialesMonthDayBody').append('<td colspan="36">No se han encontrado resultados</t>')
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
    })
}

/**
 * Obtiene los datos para la sección de judiciales
 */
function getJudicialesDaysWeek(){

    var yearJudiciales = $("#yearJudicialesWeek").val();
    var monthJudiciales = null;
    if($("#monthJudicialesWeek").val() != null && $("#monthJudicialesWeek").val() != '0'){
        monthJudiciales = $("#monthJudicialesWeek").val();
    }

    var departureJudiciales = 0;
    if($("#departureJudicialesWeek").prop('checked')){
        departureJudiciales = 1;
    }

    var returnJudiciales = 0;
    if($("#returnJudicialesWeek").prop('checked')){
        returnJudiciales = 1;
    }

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getJudicialesMonthsDays',
            year: yearJudiciales,
            month: monthJudiciales,
            departure: departureJudiciales,
            return: returnJudiciales
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                $('#judicialesDaysWeekBody').empty();

                if(data.length > 0){

                    var totalDaysWeek = new Array;
                    var totalDaysMorningWeek = new Array;
                    var totalDaysNightWeek = new Array;
                    for (i=1; i<8; i++){
                        totalDaysWeek[i] = 0;
                        totalDaysMorningWeek[i] = 0;
                        totalDaysNightWeek[i] = 0;
                    }
    
                    $.each(data, function(index, elem){

                        totalDaysWeek[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').isoWeekday())] += 1;
                        
                        var limitInitTime = moment( moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' 07:30:00', 'YYYY-MM-DD HH:mm:ss').format('X');
                        var limitEndTime = moment(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' 21:59:59', 'YYYY-MM-DD HH:mm:ss').format('X');

                        if(
                            moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('X') >= limitInitTime && 
                            moment(elem.date, 'YYYY-MM-DD HH:mm:ss').format('X') <= limitEndTime
                        ){
                            totalDaysMorningWeek[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').isoWeekday())] += 1;
                        }else{

                            totalDaysNightWeek[parseInt(moment(elem.date, 'YYYY-MM-DD HH:mm:ss').isoWeekday())] += 1;
                        }
                    })

                    var trDays = '<tr class="text-center"><td><strong>Total</strong></td>';
                    var trMorning = '<tr class="text-center"><td><strong>Día</strong></td>';
                    var trNight = '<tr class="text-center"><td><strong>Noche</strong></td>';
                    for (i=1; i<8; i++){
                        trDays += '<td>'+totalDaysWeek[i]+'</td>';
                        trMorning += '<td>'+totalDaysMorningWeek[i]+'</td>';
                        trNight += '<td>'+totalDaysNightWeek[i]+'</td>';
                    }
                    trDays +='</tr>'
                    trMorning +='</tr>'
                    trNight +='</tr>'

                    $('#judicialesDaysWeekBody').append(trDays);
                    $('#judicialesDaysWeekBody').append(trMorning);
                    $('#judicialesDaysWeekBody').append(trNight);
                }else{
                    $('#judicialesDaysWeekBody').append('<td colspan="8">No se han encontrado resultados</t>')
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
    })
}

/**
 * Dibuja el gráfico de las defunciones por año
 * 
 * @param {array} fill Datos
 */
function drawChartDeceasedByYear(fill, type){
    $('#deceasedByYearChartSection' + type).empty()
    $('#deceasedByYearChartSection' + type).append('<canvas id="deceasedByYearChart' + type + '"></canvas>')

    var options = {
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    max: parseInt(fill[8]),
                    min: 0
                }
            }]
        }
    }

    var labelType = 'Defunciones por año';
    if(type == 'C'){
        labelType += ' (Cremaciones)'
    }else if(type == 'S'){
        labelType += ' (Sala)'
    }else if(type == 'DS'){
        labelType += ' (Propias)'
    }

    var data = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
            label: labelType,
            data: [
                parseInt(fill[1]),
                parseInt(fill[2]),
                parseInt(fill[3]),
                parseInt(fill[4]),
                parseInt(fill[5]),
                parseInt(fill[6]),
                parseInt(fill[7])
            ],
            backgroundColor: [
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490'
            ],
            borderColor: [
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490'
            ],
            borderWidth: 1
        }]
    }
    
    new Chart(document.getElementById("deceasedByYearChart" + type), {
        type: 'bar',
        data: data,
        options: options
    })
}

/**
 * Dibuja el gráfico de las defunciones por año (día)
 * 
 * @param {array} fill Datos
 */
function drawChartDeceasedByYearDay(fill){
    $('#deceasedByYearDayChartSection').empty()
    $('#deceasedByYearDayChartSection').append('<canvas id="deceasedByYearDayChart"></canvas>')

    var options = {
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    max: fill[8],
                    min: 0
                }
            }]
        }
    }

    var data = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[1],
                fill[2],
                fill[3],
                fill[4],
                fill[5],
                fill[6],
                fill[7]
            ],
            backgroundColor: [
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490'
            ],
            borderColor: [
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490'
            ],
            borderWidth: 1
        }]
    }
    
    new Chart(document.getElementById("deceasedByYearDayChart"), {
        type: 'bar',
        data: data,
        options: options
    })
}

/**
 * Dibuja el gráfico de las defunciones por año (noche)
 * 
 * @param {array} fill Datos
 */
function drawChartDeceasedByYearNight(fill){
    $('#deceasedByYearNightChartSection').empty()
    $('#deceasedByYearNightChartSection').append('<canvas id="deceasedByYearNightChart"></canvas>')

    var options = {
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    max: fill[8],
                    min: 0
                }
            }]
        }
    }

    var data = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Defunciones por noche en ' + fill[0],
            data: [
                fill[1],
                fill[2],
                fill[3],
                fill[4],
                fill[5],
                fill[6],
                fill[7]
            ],
            backgroundColor: [
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490'
            ],
            borderColor: [
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490',
                '#002490'
            ],
            borderWidth: 1
        }]
    }
    
    new Chart(document.getElementById("deceasedByYearNightChart"), {
        type: 'bar',
        data: data,
        options: options
    })
}

/**
 * Dibuja el gráfico de día vs noche
 * 
 * @param {array} fill Datos
 */
function drawChartDayvsnight(fill){
    // Lunes
    $('#dayvsnightChartMondaySection').empty()
    $('#dayvsnightChartMondaySection').append('<canvas id="dayvsnightChartMonday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[1][0],
                fill[1][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartMonday"), {
        type: 'pie',
        data: data
    })

    // Martes
    $('#dayvsnightChartTuesdaySection').empty()
    $('#dayvsnightChartTuesdaySection').append('<canvas id="dayvsnightChartTuesday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[2][0],
                fill[2][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartTuesday"), {
        type: 'pie',
        data: data
    })

    // Miércoles
    $('#dayvsnightChartWednesdaySection').empty()
    $('#dayvsnightChartWednesdaySection').append('<canvas id="dayvsnightChartWednesday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[3][0],
                fill[3][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartWednesday"), {
        type: 'pie',
        data: data
    })

    // Jueves
    $('#dayvsnightChartThursdaySection').empty()
    $('#dayvsnightChartThursdaySection').append('<canvas id="dayvsnightChartThursday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[4][0],
                fill[4][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartThursday"), {
        type: 'pie',
        data: data
    })

    // Viernes
    $('#dayvsnightChartFridaySection').empty()
    $('#dayvsnightChartFridaySection').append('<canvas id="dayvsnightChartFriday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[5][0],
                fill[5][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartFriday"), {
        type: 'pie',
        data: data
    })

    // Sábado
    $('#dayvsnightChartSaturdaySection').empty()
    $('#dayvsnightChartSaturdaySection').append('<canvas id="dayvsnightChartSaturday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[6][0],
                fill[6][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartSaturday"), {
        type: 'pie',
        data: data
    })

    // Domingo
    $('#dayvsnightChartSundaySection').empty()
    $('#dayvsnightChartSundaySection').append('<canvas id="dayvsnightChartSunday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[7][0],
                fill[7][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartSunday"), {
        type: 'pie',
        data: data
    })

    // Promedio
    $('#dayvsnightChartAverageSection').empty()
    $('#dayvsnightChartAverageSection').append('<canvas id="dayvsnightChartAverage"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[8][0],
                fill[8][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("dayvsnightChartAverage"), {
        type: 'pie',
        data: data
    })
}

/**
 * Dibuja el gráfico de noche vs día
 * 
 * @param {array} fill Datos
 */
function drawChartNightvsday(fill){
    // Lunes
    $('#nightvsdayChartMondaySection').empty()
    $('#nightvsdayChartMondaySection').append('<canvas id="nightvsdayChartMonday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[1][0],
                fill[1][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartMonday"), {
        type: 'pie',
        data: data
    })

    // Martes
    $('#nightvsdayChartTuesdaySection').empty()
    $('#nightvsdayChartTuesdaySection').append('<canvas id="nightvsdayChartTuesday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[2][0],
                fill[2][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartTuesday"), {
        type: 'pie',
        data: data
    })

    // Miércoles
    $('#nightvsdayChartWednesdaySection').empty()
    $('#nightvsdayChartWednesdaySection').append('<canvas id="nightvsdayChartWednesday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[3][0],
                fill[3][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartWednesday"), {
        type: 'pie',
        data: data
    })

    // Jueves
    $('#nightvsdayChartThursdaySection').empty()
    $('#nightvsdayChartThursdaySection').append('<canvas id="nightvsdayChartThursday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[4][0],
                fill[4][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartThursday"), {
        type: 'pie',
        data: data
    })

    // Viernes
    $('#nightvsdayChartFridaySection').empty()
    $('#nightvsdayChartFridaySection').append('<canvas id="nightvsdayChartFriday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[5][0],
                fill[5][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartFriday"), {
        type: 'pie',
        data: data
    })

    // Sábado
    $('#nightvsdayChartSaturdaySection').empty()
    $('#nightvsdayChartSaturdaySection').append('<canvas id="nightvsdayChartSaturday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[6][0],
                fill[6][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartSaturday"), {
        type: 'pie',
        data: data
    })

    // Domingo
    $('#nightvsdayChartSundaySection').empty()
    $('#nightvsdayChartSundaySection').append('<canvas id="nightvsdayChartSunday"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[7][0],
                fill[7][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartSunday"), {
        type: 'pie',
        data: data
    })

    // Promedio
    $('#nightvsdayChartAverageSection').empty()
    $('#nightvsdayChartAverageSection').append('<canvas id="nightvsdayChartAverage"></canvas>')

    var data = {
        labels: ['Día', 'Noche'],
        datasets: [{
            label: 'Defunciones por día en ' + fill[0],
            data: [
                fill[8][0],
                fill[8][1]
            ],
            backgroundColor: [
                '#002490',
                'grey'
            ]
        }]
    }
    
    new Chart(document.getElementById("nightvsdayChartAverage"), {
        type: 'pie',
        data: data
    })
}

/**
 * Obtenemos los datos estadísticas
 * 
 * @param {string} dateStart Fecha de inicio para filtrar
 * @param {string} dateEnd Fecha de fin para filtrar
 * @param {int} products Producto para filtrar
 * @param {int} mortuaries Casa mortuoria para filtrar
 */
function getStatisticGeneralData(dateStart=null, dateEnd=null, products=null, mortuaries=null){
    
    var values;
    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getGeneralStatistics',
            dateStart: dateStart,
            dateEnd: dateEnd,
            products: products,
            mortuaries : mortuaries
        },
        async: false,
        success: function(data){
            try{
                values = $.parseJSON(data)
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
    })
    return values;
}   

/**
 * Obtiene las estadísticas generales sobre seguros, empresa y particulares
 * 
 * @param {string} dateStart Fecha de inicio para filtrar
 * @param {string} dateEnd Fecha de fin para filtrar
 * @param {int} products Producto para filtrar
 * @param {int} mortuaries Casa mortuoria para filtrar
 */
function getGeneralStatistics(dateStart=null,dateEnd=null, products=null, mortuaries=null){

    $.ajax({
        url: uri + 'core/statistics/functions.php',
        method: 'POST',
        data: {
            type: 'getGeneralStatistics',
            dateStart: dateStart,
            dateEnd: dateEnd,
            products: products,
            mortuaries : mortuaries
        },
        async: false,
        success: function(data){
          
                data = $.parseJSON(data)
                
                $('#generalsBody').empty();
                $('#generalsBody').append('<tr>'
                                               + '<td class="toBold text-center">CLIENTES</td>'
                                               + '<td class="toBold text-center" style="white-space: nowrap;">Nº EXP</td>'
                                               + '<td class="toBold text-center general-coronas">CORONAS</td>'
                                               + '<td class="toBold text-center general-coronas">PRECIO DE COSTE</td>'
                                               + '<td class="toBold text-center general-coronas">IMPORTE FACTURADO</td>'
                                               + '<td class="toBold text-center general-coronas">MARGEN (SIN ' + getIvaLabel() + ')</td>'
                                               + '<td class="toBold text-center general-centros">CENTROS</td>'
                                               + '<td class="toBold text-center general-centros">PRECIO DE COSTE</td>'
                                               + '<td class="toBold text-center general-centros">IMPORTE FACTURADO</td>'
                                               + '<td class="toBold text-center general-centros">MARGEN (SIN ' + getIvaLabel() + ')</td>'
                                               + '<td class="toBold text-center general-cremaciones">CREMACIONES</td>'
                                               + '<td class="toBold text-center general-cremaciones">PRECIO DE COSTE</td>'
                                               + '<td class="toBold text-center general-cremaciones">IMPORTE FACTURADO</td>'
                                               + '<td class="toBold text-center general-cremaciones">MARGEN (SIN ' + getIvaLabel() + ')</td>'
                                               + '<td class="toBold text-center general-edades">Nº HOMBRES</td>'
                                               + '<td class="toBold text-center general-edades">EDAD MEDIA</td>'
                                               + '<td class="toBold text-center general-edades">Nº MUJERES</td>'
                                               + '<td class="toBold text-center general-edades">EDAD MEDIA</td>'
                                               + '<td class="toBold text-center general-facturacion">BASE IMPONIBLE</td>'
                                               + '<td class="toBold text-center general-facturacion">TOTAL ' + getIvaLabel() + '</td>'
                                               + '<td class="toBold text-center general-facturacion">MARGEN BRUTO SIN SUPLIDOS NI ' + getIvaLabel() + '</td>'
                                               + '<td class="toBold text-center general-facturacion">TOTAL FACTURACIÓN SERVICIOS</td>'
                                               + '<td class="toBold text-center general-tiempos">TIEMPO COBRO MEDIO</td>'
                                               + '<td class="toBold text-center general-tiempos">TIEMPO RESPUESTA MEDIO</td>'
                                            + '</tr>')
                $content = '';

                var totalExpedients = 0;
                var totalCoronas = 0;
                var totalPrecioCosteCoronas = 0;
                var totalFacturadoCoronas = 0;
                var totalMargenCoronas = 0;

                var totalRamos = 0;
                var totalPrecioCosteRamos = 0;
                var totalFacturadoRamos = 0;
                var totalMargenRamos = 0;

                var totalCremaciones = 0;
                var totalPrecioCosteCremaciones = 0;
                var totalFacturadoCremaciones = 0;
                var totalMargenCremaciones = 0;

                var totalNumHombres = 0;
                var indexHombres = 0;
                var totalEdadMediaHombres = 0;
                var totalNumMujeres = 0;
                var indexMujeres = 0;
                var totalEdadMediaMujeres = 0;

                var totalBaseImponible = 0;
                var indexBaseImponible = 0;

                var totalIva = 0

                var totalMargenBruto = 0;
                var totalTotalFacturacion = 0;

                var dayCobro = 0;
                var hourCobro = 0;
                var minuteCobro = 0;
                var indexTiempoCobro = 0;
                var sumCobro = 0;
             
                var dayRespuesta = 0;
                var hourRespuesta = 0;
                var minuteRespuesta = 0;
                var indexTiempoRespuesta = 0;
                var sumRespuesta = 0;
                
                for (var i = 0; i < data.coronas.length; i++) {
                    
                    totalExpedients += parseInt(data.expedientes[i].expedients);
                    data.coronas[i].coronas = data.coronas[i].coronas == null ? 0 : data.coronas[i].coronas
                    totalCoronas += parseInt(data.coronas[i].coronas);

                    data.coronas[i].precioCosteCoronas = data.coronas[i].precioCosteCoronas == null ? 0 : data.coronas[i].precioCosteCoronas
                    totalPrecioCosteCoronas += parseFloat(data.coronas[i].precioCosteCoronas);

                    data.coronas[i].importeFacturadoCoronas = data.coronas[i].importeFacturadoCoronas == null ? 0 : data.coronas[i].importeFacturadoCoronas
                    totalFacturadoCoronas += parseFloat(data.coronas[i].importeFacturadoCoronas);

                    data.coronas[i].margenSinIvaCoronas = data.coronas[i].margenSinIvaCoronas == null ? 0 : data.coronas[i].margenSinIvaCoronas
                    totalMargenCoronas += parseFloat(data.coronas[i].margenSinIvaCoronas);

                    data.ramos[i].ramos = data.ramos[i].ramos == null ? 0 : data.ramos[i].ramos
                    totalRamos += parseInt(data.ramos[i].ramos);

                    data.ramos[i].precioCosteRamos = data.ramos[i].precioCosteRamos == null ? 0 : data.ramos[i].precioCosteRamos
                    totalPrecioCosteRamos += parseFloat(data.ramos[i].precioCosteRamos);

                    data.ramos[i].importeFacturadoRamos = data.ramos[i].importeFacturadoRamos == null ? 0 : data.ramos[i].importeFacturadoRamos
                    totalFacturadoRamos += parseFloat(data.ramos[i].importeFacturadoRamos);

                    data.ramos[i].margenSinIvaRamos = data.ramos[i].margenSinIvaRamos == null ? 0 : data.ramos[i].margenSinIvaRamos
                    totalMargenRamos += parseFloat(data.ramos[i].margenSinIvaRamos);

                    data.cremaciones[i].cremaciones = data.cremaciones[i].cremaciones == null ? 0 : data.cremaciones[i].cremaciones
                    totalCremaciones += parseInt(data.cremaciones[i].cremaciones);

                    data.cremaciones[i].precioCosteCremaciones = data.cremaciones[i].precioCosteCremaciones == null ? 0 : data.cremaciones[i].precioCosteCremaciones
                    totalPrecioCosteCremaciones += parseFloat(data.cremaciones[i].precioCosteCremaciones);

                    data.cremaciones[i].importeFacturadoCremaciones = data.cremaciones[i].importeFacturadoCremaciones == null ? 0 : data.cremaciones[i].importeFacturadoCremaciones
                    totalFacturadoCremaciones += parseFloat(data.cremaciones[i].importeFacturadoCremaciones);

                    data.cremaciones[i].margenSinIvaCremaciones = data.cremaciones[i].margenSinIvaCremaciones == null ? 0 : data.cremaciones[i].margenSinIvaCremaciones
                    totalMargenCremaciones += parseFloat(data.cremaciones[i].margenSinIvaCremaciones);

                    data.numHombres[i] = data.numHombres[i] == null ? 0 : data.numHombres[i]
                    totalNumHombres += parseInt(data.numHombres[i]);
                    data.edadMediaHombres[i] = data.edadMediaHombres[i] == null ? 0 : data.edadMediaHombres[i]
                    totalEdadMediaHombres +=  Math.round(data.edadMediaHombres[i]);
                    if(data.edadMediaHombres[i] != 0){
                        indexHombres++;
                    }

                    data.numMujeres[i] = data.numMujeres[i] == null ? 0 : data.numMujeres[i]
                    totalNumMujeres += parseInt(data.numMujeres[i]);
                    data.edadMediaMujeres[i] = data.edadMediaMujeres[i] == null ? 0 : data.edadMediaMujeres[i]
                    totalEdadMediaMujeres +=  Math.round(data.edadMediaMujeres[i]);
                    if(data.edadMediaMujeres[i] != 0){
                        indexMujeres++;
                    }

                    data.baseImponible[i].baseImponible = data.baseImponible[i].baseImponible == null ? 0 : data.baseImponible[i].baseImponible
                    totalBaseImponible += parseFloat(data.baseImponible[i].baseImponible)
                    if(data.baseImponible[i].baseImponible > 0){
                        indexBaseImponible++;
                    }

                    data.margenBruto[i].margenBruto = data.margenBruto[i].margenBruto == null ? 0 : data.margenBruto[i].margenBruto
                    totalMargenBruto += parseFloat(data.margenBruto[i].margenBruto)

                    data.iva[i].totalIVA = data.iva[i].totalIVA == null ? 0 : data.iva[i].totalIVA
                    totalIva += parseFloat(data.iva[i].totalIVA)

                    data.totalFacturado[i].totalFacturado = data.totalFacturado[i].totalFacturado == null ? 0 : data.totalFacturado[i].totalFacturado
                    totalTotalFacturacion += parseFloat(data.totalFacturado[i].totalFacturado)
                    
                    data.tiempoCobro[i].tiempoCobro = data.tiempoCobro[i].tiempoCobro == null ? '-' : data.tiempoCobro[i].tiempoCobro
                    var auxTimeCobro = '-';
                    if(data.tiempoCobro[i].tiempoCobro != '-'){
                        auxTimeCobro = parseFloat(data.tiempoCobro[i].tiempoCobro).toFixed(2) + ' días'
                        sumCobro += parseFloat(data.tiempoCobro[i].tiempoCobro)

                        indexTiempoCobro++;
                    }

                    var auxTimeRespuesta = 0;
                    var auxHourRespuesta = 0;
                    var auxMinuteRespuesta = 0;
                    var auxHourRespuestaAux = 0;
                    var auxMinuteRespuestaAux = 0;
                    if(data.tiempoRespuesta[i] != 0){
                        if(data.tiempoRespuesta[i].length > 0){
                            $.each(data.tiempoRespuesta[i], function(index, elem){
                                var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                var diff = arriveTime.getTime() - requestTime.getTime()
                                
                                //When arrive time is bigger than request time
                                if(diff < 0){ 
                                    var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                                    var arriveTime = new Date(arriveTimeAux)
                                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                    var diff = arriveTime.getTime() - requestTime.getTime()
                                }

                                auxHourRespuestaAux = 0;
                                auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                                while(auxMinuteRespuestaAux >= 60){
                                    auxHourRespuestaAux++;
                                    auxMinuteRespuestaAux -= 60;
                                }
    
                                auxHourRespuesta += auxHourRespuestaAux;
                                auxMinuteRespuesta += auxMinuteRespuestaAux;
                            })
    
                            let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                            let averageSeconds = seconds / data.tiempoRespuesta[i].length

                            auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                            auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                            while(auxMinuteRespuesta >= 60){
                                auxHourRespuesta += 1;
                                auxMinuteRespuesta -= 60;
                            }

                            hourRespuesta += Math.floor((averageSeconds % 86400) / 3600);
                            minuteRespuesta += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                            while(minuteRespuesta >= 60){
                                hourRespuesta += 1;
                                minuteRespuesta -= 60;
                            }

                            auxTimeRespuesta =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                            indexTiempoRespuesta++;
                        }
                    }

                    $content += 
                        '   <tr class="text-center">' +
                        '       <td style="white-space: nowrap;"><strong>' + data.expedientes[i].name + '</strong></td>' +
                        '       <td id="'+ data.expedientes[i].clientID + '" style="cursor: pointer; text-decoration: underline;" class="expedients" >' + toFormatNumber(data.expedientes[i].expedients) + '</td>' +
                        '       <td class="general-coronas">' + toFormatNumber(data.coronas[i].coronas) + '</td>' +
                        '       <td class="general-coronas">' + toFormatNumber(parseFloat(data.coronas[i].precioCosteCoronas).toFixed(2)) + '</td>' +
                        '       <td class="general-coronas">' + toFormatNumber(parseFloat(data.coronas[i].importeFacturadoCoronas).toFixed(2)) + '</td>' +
                        '       <td class="general-coronas">' + toFormatNumber(parseFloat(data.coronas[i].margenSinIvaCoronas).toFixed(2)) + '</td>'+

                        '       <td class="general-centros">' + toFormatNumber(data.ramos[i].ramos) + '</td>' +
                        '       <td class="general-centros">' + toFormatNumber(parseFloat(data.ramos[i].precioCosteRamos).toFixed(2)) + '</td>' +
                        '       <td class="general-centros">' + toFormatNumber(parseFloat(data.ramos[i].importeFacturadoRamos).toFixed(2)) + '</td>' +
                        '       <td class="general-centros">' + toFormatNumber(parseFloat(data.ramos[i].margenSinIvaRamos).toFixed(2)) + '</td>' +

                        '       <td class="general-cremaciones">' + toFormatNumber(data.cremaciones[i].cremaciones) + '</td>' +
                        '       <td class="general-cremaciones">' + toFormatNumber(parseFloat(data.cremaciones[i].precioCosteCremaciones).toFixed(2)) + '</td>' +
                        '       <td class="general-cremaciones">' + toFormatNumber(parseFloat(data.cremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</td>' +
                        '       <td class="general-cremaciones">' + toFormatNumber(parseFloat(data.cremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</td>' +

                        '       <td class="general-edades">' + toFormatNumber(data.numHombres[i]) + '</td>' +
                        '       <td class="general-edades">' + toFormatNumber(Math.round(data.edadMediaHombres[i])) + '</td>' +
                        '       <td class="general-edades">' + toFormatNumber(data.numMujeres[i]) + '</td>' +
                        '       <td class="general-edades">' + toFormatNumber(Math.round(data.edadMediaMujeres[i])) + '</td>' +

                        '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.baseImponible[i].baseImponible).toFixed(2)) + '</td>' +
                        '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.iva[i].totalIVA).toFixed(2)) + '</td>' +
                        '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.margenBruto[i].margenBruto).toFixed(2)) + '</td>' +
                        '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.totalFacturado[i].totalFacturado).toFixed(2)) + '</td>' +
                        '       <td class="general-tiempos">' + auxTimeCobro + '</td>' +
                        '       <td class="general-tiempos">' + (auxTimeRespuesta == 0 ? '-' : auxTimeRespuesta)+ '</td>' +
                        '   </tr>'
                }
                
                for (var i = 0; i < data.particularesCoronas.length; i++) {
                    
                    totalExpedients += parseInt(data.particularesExpedientes[i].expedients);
                    
                    data.particularesCoronas[i].coronas = data.particularesCoronas[i].coronas == null ? 0 : data.particularesCoronas[i].coronas
                    totalCoronas += parseInt(data.particularesCoronas[i].coronas);

                    data.particularesCoronas[i].precioCosteCoronas = data.particularesCoronas[i].precioCosteCoronas == null ? 0 : data.particularesCoronas[i].precioCosteCoronas
                    totalPrecioCosteCoronas += parseFloat(data.particularesCoronas[i].precioCosteCoronas);

                    data.particularesCoronas[i].importeFacturadoCoronas = data.particularesCoronas[i].importeFacturadoCoronas == null ? 0 : data.particularesCoronas[i].importeFacturadoCoronas
                    totalFacturadoCoronas += parseFloat(data.particularesCoronas[i].importeFacturadoCoronas);

                    data.particularesCoronas[i].margenSinIvaCoronas = data.particularesCoronas[i].margenSinIvaCoronas == null ? 0 : data.particularesCoronas[i].margenSinIvaCoronas
                    totalMargenCoronas += parseFloat(data.particularesCoronas[i].margenSinIvaCoronas);

                    data.particularesRamos[i].ramos = data.particularesRamos[i].ramos == null ? 0 : data.particularesRamos[i].ramos
                    totalRamos += parseInt(data.particularesRamos[i].ramos);

                    data.particularesRamos[i].precioCosteRamos = data.particularesRamos[i].precioCosteRamos == null ? 0 : data.particularesRamos[i].precioCosteRamos
                    totalPrecioCosteRamos += parseFloat(data.particularesRamos[i].precioCosteRamos);

                    data.particularesRamos[i].importeFacturadoRamos = data.particularesRamos[i].importeFacturadoRamos == null ? 0 : data.particularesRamos[i].importeFacturadoRamos
                    totalFacturadoRamos += parseFloat(data.particularesRamos[i].importeFacturadoRamos);

                    data.particularesRamos[i].margenSinIvaRamos = data.particularesRamos[i].margenSinIvaRamos == null ? 0 : data.particularesRamos[i].margenSinIvaRamos
                    totalMargenRamos += parseFloat(data.particularesRamos[i].margenSinIvaRamos);

                    data.particularesCremaciones[i].cremaciones = data.particularesCremaciones[i].cremaciones == null ? 0 : data.particularesCremaciones[i].cremaciones
                    totalCremaciones += parseInt(data.particularesCremaciones[i].cremaciones)

                    data.particularesCremaciones[i].precioCosteCremaciones = data.particularesCremaciones[i].precioCosteCremaciones == null ? 0 : data.particularesCremaciones[i].precioCosteCremaciones
                    totalPrecioCosteCremaciones += parseFloat(data.particularesCremaciones[i].precioCosteCremaciones);

                    data.particularesCremaciones[i].importeFacturadoCremaciones = data.particularesCremaciones[i].importeFacturadoCremaciones == null ? 0 : data.particularesCremaciones[i].importeFacturadoCremaciones
                    totalFacturadoCremaciones += parseFloat(data.particularesCremaciones[i].importeFacturadoCremaciones);

                    data.particularesCremaciones[i].margenSinIvaCremaciones = data.particularesCremaciones[i].margenSinIvaCremaciones == null ? 0 : data.particularesCremaciones[i].margenSinIvaCremaciones
                    totalMargenCremaciones += parseFloat(data.particularesCremaciones[i].margenSinIvaCremaciones);

                    data.particularesNumHombres[i] = data.particularesNumHombres[i] == null ? 0 : data.particularesNumHombres[i]
                    totalNumHombres += parseInt(data.particularesNumHombres[i]);
                    data.particularesEdadMediaHombres[i] = data.particularesEdadMediaHombres[i] == null ? 0 : data.particularesEdadMediaHombres[i]
                    totalEdadMediaHombres +=  Math.round(data.particularesEdadMediaHombres[i]);
                    if(data.particularesEdadMediaHombres[i] != 0){
                        indexHombres++;
                    }

                    data.particularesNumMujeres[i] = data.particularesNumMujeres[i] == null ? 0 : data.particularesNumMujeres[i]
                    totalNumMujeres += parseInt(data.particularesNumMujeres[i]);
                    data.particularesEdadMediaMujeres[i] = data.particularesEdadMediaMujeres[i] == null ? 0 : data.particularesEdadMediaMujeres[i]
                    totalEdadMediaMujeres +=  Math.round(data.particularesEdadMediaMujeres[i]);
                    if(data.particularesEdadMediaMujeres[i] != 0){
                        indexMujeres++;
                    }

                    data.particularesBaseImponible[i].baseImponible = data.particularesBaseImponible[i].baseImponible == null ? 0 : data.particularesBaseImponible[i].baseImponible
                    totalBaseImponible += parseFloat(data.particularesBaseImponible[i].baseImponible);
                    if(data.particularesBaseImponible[i].baseImponible > 0){
                        indexBaseImponible++;
                    }

                    data.particularesMargenBruto[i].margenBruto = data.particularesMargenBruto[i].margenBruto == null ? 0 : data.particularesMargenBruto[i].margenBruto
                    totalMargenBruto += parseFloat(data.particularesMargenBruto[i].margenBruto);

                    data.particularesIva[i].totalIVA = data.particularesIva[i].totalIVA == null ? 0 : data.particularesIva[i].totalIVA
                    totalIva += parseFloat(data.particularesIva[i].totalIVA);

                    data.particularesTotalFacturado[i].totalFacturado = data.particularesTotalFacturado[i].totalFacturado == null ? 0 : data.particularesTotalFacturado[i].totalFacturado
                    totalTotalFacturacion += parseFloat(data.particularesTotalFacturado[i].totalFacturado);

                    data.particularesTiempoCobro[i].tiempoCobro = data.particularesTiempoCobro[i].tiempoCobro == null ? '-' : data.particularesTiempoCobro[i].tiempoCobro
                    var auxHourParticularCobro = 0;
                    var auxMinuteParticularCobro = 0;
                    var auxParticularCobro = '-';
                    if(data.particularesTiempoCobro[i].tiempoCobro != '-'){
                        auxParticularCobro = parseFloat(data.particularesTiempoCobro[i].tiempoCobro).toFixed(2) + ' días'
                        sumCobro += parseFloat(data.particularesTiempoCobro[i].tiempoCobro)
                        indexTiempoCobro++;
                    }
             
                    var auxParticularRespuesta = 0;
                    var auxHourRespuesta = 0;
                    var auxMinuteRespuesta = 0;
                    var auxHourRespuestaAux = 0;
                    var auxMinuteRespuestaAux = 0;
                    if(data.particularesTiempoRespuesta[i] != 0){
                        if(data.particularesTiempoRespuesta[i].length > 0){
                            $.each(data.particularesTiempoRespuesta[i], function(index, elem){
                                var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                var diff = arriveTime.getTime() - requestTime.getTime()

                                //When arrive time is bigger than request time
                                if(diff < 0){ 
                                    var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                                    var arriveTime = new Date(arriveTimeAux)
                                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                    var diff = arriveTime.getTime() - requestTime.getTime()
                                }

                                auxHourRespuestaAux = 0;
                                auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                                while(auxMinuteRespuestaAux >= 60){
                                    auxHourRespuestaAux++;
                                    auxMinuteRespuestaAux -= 60;
                                }
    
                                auxHourRespuesta += auxHourRespuestaAux;
                                auxMinuteRespuesta += auxMinuteRespuestaAux;
                            })
    
                            let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                            let averageSeconds = seconds / data.particularesTiempoRespuesta[i].length

                            auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                            auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                            while(auxMinuteRespuesta >= 60){
                                auxHourRespuesta += 1;
                                auxMinuteRespuesta -= 60;
                            }

                            hourRespuesta += Math.floor((averageSeconds % 86400) / 3600);
                            minuteRespuesta += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                            while(minuteRespuesta >= 60){
                                hourRespuesta += 1;
                                minuteRespuesta -= 60;
                            }

                            auxParticularRespuesta =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                            indexTiempoRespuesta++;
                        }
                    }

                    $content += '   <tr class="text-center">' +
                                '       <td><strong>Particulares</strong></td>' +
                                '       <td id="'+ data.particularesExpedientes[i].clientID + '" style="cursor: pointer; text-decoration: underline" class="particularesExpedientes" >' + data.particularesExpedientes[i].expedients + '</td>' +
                                
                                '       <td class="general-coronas">' + toFormatNumber(data.particularesCoronas[i].coronas) + '</td>' +
                                '       <td class="general-coronas">' + toFormatNumber(parseFloat(data.particularesCoronas[i].precioCosteCoronas).toFixed(2)) + '</td>' +
                                '       <td class="general-coronas">' + toFormatNumber(parseFloat(data.particularesCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</td>' +
                                '       <td class="general-coronas">' + toFormatNumber(parseFloat(data.particularesCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</td>' +

                                '       <td class="general-centros">' + toFormatNumber(data.particularesRamos[i].ramos) + '</td>' +
                                '       <td class="general-centros">' + toFormatNumber(data.particularesRamos[i].precioCosteRamos) + '</td>' +
                                '       <td class="general-centros">' + toFormatNumber(data.particularesRamos[i].importeFacturadoRamos) + '</td>' +
                                '       <td class="general-centros">' + toFormatNumber(data.particularesRamos[i].margenSinIvaRamos) + '</td>' +

                                '       <td class="general-cremaciones">' + toFormatNumber(data.particularesCremaciones[i].cremaciones) + '</td>' +
                                '       <td class="general-cremaciones">' + toFormatNumber(data.particularesCremaciones[i].precioCosteCremaciones) + '</td>' +
                                '       <td class="general-cremaciones">' + toFormatNumber(data.particularesCremaciones[i].importeFacturadoCremaciones) + '</td>' +
                                '       <td class="general-cremaciones">' + toFormatNumber(data.particularesCremaciones[i].margenSinIvaCremaciones) + '</td>' +

                                '       <td class="general-edades">' + toFormatNumber(data.particularesNumHombres[i]) + '</td>' +
                                '       <td class="general-edades">' + toFormatNumber(Math.round(data.particularesEdadMediaHombres[i])) + '</td>' +
                                '       <td class="general-edades">' + toFormatNumber(data.particularesNumMujeres[i]) + '</td>' +
                                '       <td class="general-edades">' + toFormatNumber(Math.round(data.particularesEdadMediaMujeres[i])) + '</td>' +

                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.particularesBaseImponible[i].baseImponible).toFixed(2)) + '</td>' +
                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.particularesIva[i].totalIVA).toFixed(2)) + '</td>' +
                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.particularesMargenBruto[i].margenBruto).toFixed(2)) + '</td>' +
                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.particularesTotalFacturado[i].totalFacturado).toFixed(2)) + '</td>' +
                                '       <td class="general-tiempos">' + auxParticularCobro + '</td>' +
                                '       <td class="general-tiempos">' + (auxParticularRespuesta == 0 ? '-' : auxParticularRespuesta)+ '</td>' +
                                '   </tr>'
                }

                for (var i = 0; i < data.empresasCoronas.length; i++) {
                    
                    totalExpedients += parseInt(data.empresasExpedientes[i].expedients);

                    data.empresasCoronas[i].coronas = data.empresasCoronas[i].coronas == null ? 0 : data.empresasCoronas[i].coronas
                    totalCoronas += parseInt(data.empresasCoronas[i].coronas);

                    data.empresasCoronas[i].precioCosteCoronas = data.empresasCoronas[i].precioCosteCoronas == null ? 0 : data.empresasCoronas[i].precioCosteCoronas
                    totalPrecioCosteCoronas += parseFloat(data.empresasCoronas[i].precioCosteCoronas);

                    data.empresasCoronas[i].importeFacturadoCoronas = data.empresasCoronas[i].importeFacturadoCoronas == null ? 0 : data.empresasCoronas[i].importeFacturadoCoronas
                    totalFacturadoCoronas += parseFloat(data.empresasCoronas[i].importeFacturadoCoronas);

                    data.empresasCoronas[i].margenSinIvaCoronas = data.empresasCoronas[i].margenSinIvaCoronas == null ? 0 : data.empresasCoronas[i].margenSinIvaCoronas
                    totalMargenCoronas += parseFloat(data.empresasCoronas[i].margenSinIvaCoronas);

                    data.empresasRamos[i].ramos = data.empresasRamos[i].ramos == null ? 0 : data.empresasRamos[i].ramos
                    totalRamos += parseInt(data.empresasRamos[i].ramos);

                    data.empresasRamos[i].precioCosteRamos = data.empresasRamos[i].precioCosteRamos == null ? 0 : data.empresasRamos[i].precioCosteRamos
                    totalPrecioCosteRamos += parseFloat(data.empresasRamos[i].precioCosteRamos);

                    data.empresasRamos[i].importeFacturadoRamos = data.empresasRamos[i].importeFacturadoRamos == null ? 0 : data.empresasRamos[i].importeFacturadoRamos
                    totalFacturadoRamos += parseFloat(data.empresasRamos[i].importeFacturadoRamos);

                    data.empresasRamos[i].margenSinIvaRamos = data.empresasRamos[i].margenSinIvaRamos == null ? 0 : data.empresasRamos[i].margenSinIvaRamos
                    totalMargenRamos += parseFloat(data.empresasRamos[i].margenSinIvaRamos);

                    data.empresasCremaciones[i].cremaciones = data.empresasCremaciones[i].cremaciones == null ? 0 : data.empresasCremaciones[i].cremaciones
                    totalCremaciones += parseInt(data.empresasCremaciones[i].cremaciones)

                    data.empresasCremaciones[i].precioCosteCremaciones = data.empresasCremaciones[i].precioCosteCremaciones == null ? 0 : data.empresasCremaciones[i].precioCosteCremaciones
                    totalPrecioCosteCremaciones += parseFloat(data.empresasCremaciones[i].precioCosteCremaciones);

                    data.empresasCremaciones[i].importeFacturadoCremaciones = data.empresasCremaciones[i].importeFacturadoCremaciones == null ? 0 : data.empresasCremaciones[i].importeFacturadoCremaciones
                    totalFacturadoCremaciones += parseFloat(data.empresasCremaciones[i].importeFacturadoCremaciones);

                    data.empresasCremaciones[i].margenSinIvaCremaciones = data.empresasCremaciones[i].margenSinIvaCremaciones == null ? 0 : data.empresasCremaciones[i].margenSinIvaCremaciones
                    totalMargenCremaciones += parseFloat(data.empresasCremaciones[i].margenSinIvaCremaciones);

                    data.empresasNumHombres[i] = data.empresasNumHombres[i] == null ? 0 : data.empresasNumHombres[i]
                    totalNumHombres += parseInt(data.empresasNumHombres[i]);
                    data.empresasEdadMediaHombres[i] = data.empresasEdadMediaHombres[i] == null ? 0 : data.empresasEdadMediaHombres[i]
                    totalEdadMediaHombres += Math.round(data.empresasEdadMediaHombres[i]);
                    if(data.empresasEdadMediaHombres[i] != 0){
                        indexHombres++;
                    }

                    data.empresasNumMujeres[i] = data.empresasNumMujeres[i] == null ? 0 : data.empresasNumMujeres[i]
                    totalNumMujeres += parseInt(data.empresasNumMujeres[i]);
                    data.empresasEdadMediaMujeres[i] = data.empresasEdadMediaMujeres[i] == null ? 0 : data.empresasEdadMediaMujeres[i]
                    totalEdadMediaMujeres += Math.round(data.empresasEdadMediaMujeres[i]);
                    if(data.empresasEdadMediaMujeres[i] != 0){
                        indexMujeres++;
                    }

                    data.empresasBaseImponible[i].baseImponible = data.empresasBaseImponible[i].baseImponible == null ? 0 : data.empresasBaseImponible[i].baseImponible
                    totalBaseImponible += Math.round(data.empresasBaseImponible[i].baseImponible);
                    if(data.empresasBaseImponible[i].baseImponible > 0){
                        indexBaseImponible++;
                    }

                    data.empresasMargenBruto[i].margenBruto = data.empresasMargenBruto[i].margenBruto == null ? 0 : data.empresasMargenBruto[i].margenBruto
                    totalMargenBruto += parseFloat(data.empresasMargenBruto[i].margenBruto);

                    data.empresasIva[i].totalIVA = data.empresasIva[i].totalIVA == null ? 0 : data.empresasIva[i].totalIVA
                    totalIva += parseFloat(data.empresasIva[i].totalIVA);

                    data.empresasTotalFacturado[i].totalFacturado = data.empresasTotalFacturado[i].totalFacturado == null ? 0 : data.empresasTotalFacturado[i].totalFacturado
                    totalTotalFacturacion += parseFloat(data.empresasTotalFacturado[i].totalFacturado);

                    data.empresasTiempoCobro[i].tiempoCobro = data.empresasTiempoCobro[i].tiempoCobro == null ? '-' : data.empresasTiempoCobro[i].tiempoCobro
                   
                   //Tiempo cobro medio
                    var auxEmpresasCobro = '-';
                    if(data.empresasTiempoCobro[i].tiempoCobro != '-'){
                        auxEmpresasCobro = parseFloat(data.empresasTiempoCobro[i].tiempoCobro).toFixed(2) + ' días'
                        sumCobro += parseFloat(data.empresasTiempoCobro[i].tiempoCobro)
                        indexTiempoCobro++;
                    }
                
                    //Tiempo respuesta medio
                    var auxEmpresasRespuesta = 0;
                    var auxHourRespuesta = 0;
                    var auxMinuteRespuesta = 0;
                    var auxHourRespuestaAux = 0;
                    var auxMinuteRespuestaAux = 0;
                    if(data.empresasTiempoRespuesta[i] != 0){
                        if(data.empresasTiempoRespuesta[i].length > 0){
                            $.each(data.empresasTiempoRespuesta[i], function(index, elem){
                                var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                var diff = arriveTime.getTime() - requestTime.getTime()
                                
                                //When arrive time is bigger than request time
                                if(diff < 0){ 
                                    var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                                    var arriveTime = new Date(arriveTimeAux)
                                    var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                                    var diff = arriveTime.getTime() - requestTime.getTime()
                                }

                                auxHourRespuestaAux = 0;
                                auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                                while(auxMinuteRespuestaAux >= 60){
                                    auxHourRespuestaAux++;
                                    auxMinuteRespuestaAux -= 60;
                                }
    
                                auxHourRespuesta += auxHourRespuestaAux;
                                auxMinuteRespuesta += auxMinuteRespuestaAux;
                            })
    
                            let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                            let averageSeconds = seconds / data.empresasTiempoRespuesta[i].length

                            auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                            auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                            while(auxMinuteRespuesta >= 60){
                                auxHourRespuesta += 1;
                                auxMinuteRespuesta -= 60;
                            }

                            hourRespuesta += Math.floor((averageSeconds % 86400) / 3600);
                            minuteRespuesta += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                            while(minuteRespuesta >= 60){
                                hourRespuesta += 1;
                                minuteRespuesta -= 60;
                            }

                            auxEmpresasRespuesta =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                            indexTiempoRespuesta++;
                        }
                    }

                    $content += '   <tr class="text-center">' +
                                '       <td><strong>Empresas</strong></td>' +
                                '       <td id="'+ data.empresasExpedientes[i].clientID + '" style="cursor: pointer; text-decoration: underline" class="empresasExpedientes" >' + data.empresasExpedientes[i].expedients + '</td>' +  
                                
                                '       <td class="general-coronas">' + toFormatNumber(data.empresasCoronas[i].coronas) + '</td>' +
                                '       <td class="general-coronas">' + toFormatNumber(data.empresasCoronas[i].precioCosteCoronas) + '</td>' +
                                '       <td class="general-coronas">' + toFormatNumber(data.empresasCoronas[i].importeFacturadoCoronas) + '</td>' +
                                '       <td class="general-coronas">' + toFormatNumber(data.empresasCoronas[i].margenSinIvaCoronas) + '</td>' +

                                '       <td class="general-centros">' + toFormatNumber(data.empresasRamos[i].ramos) + '</td>' +
                                '       <td class="general-centros">' + toFormatNumber(data.empresasRamos[i].precioCosteRamos) + '</td>' +
                                '       <td class="general-centros">' + toFormatNumber(data.empresasRamos[i].importeFacturadoRamos) + '</td>' +
                                '       <td class="general-centros" >' + toFormatNumber(data.empresasRamos[i].margenSinIvaRamos) + '</td>' +

                                '       <td class="general-cremaciones">' + toFormatNumber(data.empresasCremaciones[i].cremaciones) + '</td>' +
                                '       <td class="general-cremaciones">' + toFormatNumber(data.empresasCremaciones[i].precioCosteCremaciones) + '</td>' +
                                '       <td class="general-cremaciones">' + toFormatNumber(data.empresasCremaciones[i].importeFacturadoCremaciones) + '</td>' +
                                '       <td class="general-cremaciones">' + toFormatNumber(data.empresasCremaciones[i].margenSinIvaCremaciones) + '</td>' +

                                '       <td class="general-edades">' + toFormatNumber(data.empresasNumHombres[i]) + '</td>' +
                                '       <td class="general-edades">' + toFormatNumber(Math.round(data.empresasEdadMediaHombres[i])) + '</td>' +
                                '       <td class="general-edades">' + toFormatNumber(data.empresasNumMujeres[i]) + '</td>' +
                                '       <td class="general-edades">' + toFormatNumber(Math.round(data.empresasEdadMediaMujeres[i])) + '</td>' +

                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.empresasBaseImponible[i].baseImponible).toFixed(2)) + '</td>' +
                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.empresasIva[i].totalIVA).toFixed(2)) + '</td>' +
                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.empresasMargenBruto[i].margenBruto).toFixed(2)) + '</td>' +
                                '       <td class="general-facturacion">' + toFormatNumber(parseFloat(data.empresasTotalFacturado[i].totalFacturado).toFixed(2)) + '</td>' +
                                '       <td class="general-tiempos">' + auxEmpresasCobro + '</td>' +
                                '       <td class="general-tiempos">' + (auxEmpresasRespuesta == 0 ? '-' : auxEmpresasRespuesta)+ '</td>' +
                                '   </tr>'
                }

                //Tiempo de Cobro
                var totalMediaTiempoCobro = "-";
                if(indexTiempoCobro > 0){
                    sumCobro = (sumCobro/indexTiempoCobro).toFixed(2)
                }else{
                    sumCobro = '-';
                }
              
                //Tiempo de Respuesta
                var totalMediaTiempoRespuesta = "-";
                if(minuteRespuesta != 0 || hourRespuesta != 0){

                    secondsTiempoRespuesta = minuteRespuesta*60 + hourRespuesta*3600
                    secondsTiempoRespuesta = secondsTiempoRespuesta/indexTiempoRespuesta
    
                    var numhoursTiempoRespuesta = Math.floor((secondsTiempoRespuesta % 86400) / 3600);
                    var numminutesTiempoRespuesta = Math.floor(((secondsTiempoRespuesta % 86400) % 3600) / 60);
    
                    totalMediaTiempoRespuesta = numhoursTiempoRespuesta + "h " + numminutesTiempoRespuesta + "min ";
                }
                
                if(indexBaseImponible == 0){
                    indexBaseImponible = 1;
                }

                if(indexMujeres == 0){
                    indexMujeres = 1;
                }

                if(indexHombres == 0){
                    indexHombres = 1;
                }

                $content += '   <tr class="text-center">' +
                                '       <td><strong>Total</strong></td>' +
                                '       <td><strong>'+ toFormatNumber(totalExpedients)+'</strong></td>' +  
                                '       <td class="general-coronas"><strong>'+ toFormatNumber(totalCoronas)+'</strong></td>' +  
                                '       <td class="general-coronas"><strong>'+ toFormatNumber(totalPrecioCosteCoronas.toFixed(2))+'</strong></td>' +  
                                '       <td class="general-coronas"><strong>'+ toFormatNumber(totalFacturadoCoronas.toFixed(2))+'</strong></td>' +  
                                '       <td class="general-coronas"><strong>'+ toFormatNumber(totalMargenCoronas.toFixed(2))+'</strong></td>' +  

                                '       <td class="general-centros"><strong>'+ toFormatNumber(totalRamos)+'</strong></td>' + 
                                '       <td class="general-centros"><strong>'+ toFormatNumber(totalPrecioCosteRamos.toFixed(2))+'</strong></td>' + 
                                '       <td class="general-centros"><strong>'+ toFormatNumber(totalFacturadoRamos.toFixed(2)) +'</strong></td>' + 
                                '       <td class="general-centros"><strong>'+ toFormatNumber(totalMargenRamos.toFixed(2)) +'</strong></td>' + 

                                '       <td class="general-cremaciones"><strong>'+ toFormatNumber(totalCremaciones)+'</strong></td>' + 
                                '       <td class="general-cremaciones"><strong>'+ toFormatNumber(totalPrecioCosteCremaciones.toFixed(2))+'</strong></td>' + 
                                '       <td class="general-cremaciones"><strong>'+ toFormatNumber(totalFacturadoCremaciones.toFixed(2))+'</strong></td>' + 
                                '       <td class="general-cremaciones"><strong>'+ toFormatNumber(totalMargenCremaciones.toFixed(2))+'</strong></td>' + 

                                '       <td class="general-edades"><strong>'+ toFormatNumber(totalNumHombres)+'</strong></td>' + 
                                '       <td class="general-edades"><strong>'+ toFormatNumber(Math.round(totalEdadMediaHombres/indexHombres))+'</strong></td>' + 
                                '       <td class="general-edades"><strong>'+ toFormatNumber(totalNumMujeres)+'</strong></td>' + 
                                '       <td class="general-edades"><strong>'+ toFormatNumber(Math.round(totalEdadMediaMujeres/indexMujeres))+'</strong></td>' + 

                                '       <td class="general-facturacion"><strong>'+ toFormatNumber(totalBaseImponible.toFixed(2)) +'</strong></td>' + 
                                '       <td class="general-facturacion"><strong>'+ toFormatNumber((totalIva).toFixed(2)) +'</strong></td>' + 
                                '       <td class="general-facturacion"><strong>'+ toFormatNumber(totalMargenBruto.toFixed(2)) +'</strong></td>' + 
                                '       <td class="general-facturacion"><strong>'+ toFormatNumber(totalTotalFacturacion.toFixed(2)) +'</strong></td>' + 
                                '       <td class="general-tiempos"><strong>'+ sumCobro +' días</strong></td>' + 
                                '       <td class="general-tiempos"><strong>'+ totalMediaTiempoRespuesta +'</strong></td>' + 
                                '   </tr>'


                $('#generalsBody').append($content);
                detectClientID();
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
}

/**
 * Obtiene las estadísticas generales sobre seguros, empresa y particulares con diferentes comparaciones
 * 
 * @param {Array} compA Comparación 1
 * @param {Array} compB Comparación 2
 */
function getGeneralStatisticsToCompare(compA, compB){

    $('#generalsBody').empty();
    $('#generalsBody').append('<tr>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CLIENTES</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">Nº EXP A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">Nº EXP B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CORONAS A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CORONAS B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">PRECIO DE COSTE A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">PRECIO DE COSTE B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">IMP FACTURADO A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">IMP FACTURADO B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CENTROS A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CENTROS B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">PRECIO DE COSTE A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">PRECIO DE COSTE B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">IMPORTE FACTURADO A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">IMPORTE FACTURADO B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CREMACIONES A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">CREMACIONES B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">PRECIO DE COSTE A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">PRECIO DE COSTE B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">IMPORTE FACTURADO A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">IMPORTE FACTURADO B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">Nº HOMBRES A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">Nº HOMBRES B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">EDAD MEDIA A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">EDAD MEDIA B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">Nº MUJERES A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">Nº MUJERES B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">EDAD MEDIA A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">EDAD MEDIA B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">BASE IMPONIBLE A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">BASE IMPONIBLE B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN BRUTO A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">MARGEN BRUTO B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">TOTAL FACTURACIÓN A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">TOTAL FACTURACIÓN B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">TIEMPO COBRO MEDIO A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">TIEMPO COBRO MEDIO B</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">TIEMPO RESPUESTA MEDIO A</td>'
                                    + '<td class="toBold text-center" style="white-space: nowrap;">TIEMPO RESPUESTA MEDIO B</td>'
                                + '</tr>')
    $content = '';

    var totalExpedientsA = 0;
    var totalExpedientsB = 0;
    var totalCoronasA = 0;
    var totalCoronasB = 0;
    var totalPrecioCosteCoronasA = 0;
    var totalPrecioCosteCoronasB = 0;
    var totalFacturadoCoronasA = 0;
    var totalFacturadoCoronasB = 0;
    var totalMargenCoronasA = 0;
    var totalMargenCoronasB = 0;

    var totalRamosA = 0;
    var totalRamosB = 0;
    var totalPrecioCosteRamosA = 0;
    var totalPrecioCosteRamosB = 0;
    var totalFacturadoRamosA = 0;
    var totalFacturadoRamosB = 0;
    var totalMargenRamosA = 0;
    var totalMargenRamosB = 0;

    var totalCremacionesA = 0;
    var totalCremacionesB = 0;
    var totalPrecioCosteCremacionesA = 0;
    var totalPrecioCosteCremacionesB = 0;
    var totalFacturadoCremacionesA = 0;
    var totalFacturadoCremacionesB = 0;
    var totalMargenCremacionesA = 0;
    var totalMargenCremacionesB = 0;

    var totalNumHombresA = 0;
    var totalNumHombresB = 0;
    var indexHombresA = 0;
    var indexHombresB = 0;
    var totalEdadMediaHombresA = 0;
    var totalEdadMediaHombresB = 0;
    var totalNumMujeresA = 0;
    var totalNumMujeresB = 0;
    var indexMujeresA = 0;
    var indexMujeresB = 0;
    var totalEdadMediaMujeresA = 0;
    var totalEdadMediaMujeresB = 0;

    var totalBaseImponibleA = 0;
    var totalBaseImponibleB = 0;
    var indexBaseImponibleA = 0;
    var indexBaseImponibleB = 0;
    var totalMargenBrutoA = 0;
    var totalMargenBrutoB = 0;
    var totalTotalFacturacionA = 0;
    var totalTotalFacturacionB = 0;

    var dayCobroA = 0;
    var dayCobroB = 0;
    var hourCobroA = 0;
    var hourCobroB = 0;
    var minuteCobroA = 0;
    var minuteCobroB = 0;
    var indexTiempoCobroA = 0;
    var indexTiempoCobroB = 0;
    var sumCobroA = 0;
    var sumCobroB = 0;

    
    var dayRespuestaA = 0;
    var dayRespuestaB = 0;
    var hourRespuestaA = 0;
    var hourRespuestaB = 0;
    var minuteRespuestaA = 0;
    var minuteRespuestaB = 0;
    var indexTiempoRespuestaA = 0;
    var indexTiempoRespuestaB = 0;


    for (var i = 0; i < compA.coronas.length; i++) {
    
        totalExpedientsA += parseInt(compA.expedientes[i].expedients);
        totalExpedientsB += parseInt(compB.expedientes[i].expedients);
   
        compA.coronas[i].coronas =compA.coronas[i].coronas == null ? 0 :compA.coronas[i].coronas
        totalCoronasA += parseInt(compA.coronas[i].coronas);
        compB.coronas[i].coronas =compB.coronas[i].coronas == null ? 0 :compB.coronas[i].coronas
        totalCoronasB += parseInt(compB.coronas[i].coronas);

        compA.coronas[i].precioCosteCoronas =compA.coronas[i].precioCosteCoronas == null ? 0 :compA.coronas[i].precioCosteCoronas
        totalPrecioCosteCoronasA += parseFloat(compA.coronas[i].precioCosteCoronas);
        compB.coronas[i].precioCosteCoronas =compB.coronas[i].precioCosteCoronas == null ? 0 :compB.coronas[i].precioCosteCoronas
        totalPrecioCosteCoronasB += parseFloat(compB.coronas[i].precioCosteCoronas);

        compA.coronas[i].importeFacturadoCoronas =compA.coronas[i].importeFacturadoCoronas == null ? 0 :compA.coronas[i].importeFacturadoCoronas
        totalFacturadoCoronasA += parseFloat(compA.coronas[i].importeFacturadoCoronas);
        compB.coronas[i].importeFacturadoCoronas =compB.coronas[i].importeFacturadoCoronas == null ? 0 :compB.coronas[i].importeFacturadoCoronas
        totalFacturadoCoronasB += parseFloat(compB.coronas[i].importeFacturadoCoronas);

        compA.coronas[i].margenSinIvaCoronas =compA.coronas[i].margenSinIvaCoronas == null ? 0 :compA.coronas[i].margenSinIvaCoronas
        totalMargenCoronasA += parseFloat(compA.coronas[i].margenSinIvaCoronas);
        compB.coronas[i].margenSinIvaCoronas =compB.coronas[i].margenSinIvaCoronas == null ? 0 :compB.coronas[i].margenSinIvaCoronas
        totalMargenCoronasB += parseFloat(compB.coronas[i].margenSinIvaCoronas);

        compA.ramos[i].ramos = compA.ramos[i].ramos == null ? 0 : compA.ramos[i].ramos
        totalRamosA += parseInt(compA.ramos[i].ramos);
        compB.ramos[i].ramos = compB.ramos[i].ramos == null ? 0 : compB.ramos[i].ramos
        totalRamosB += parseInt(compB.ramos[i].ramos);

        compA.ramos[i].precioCosteRamos = compA.ramos[i].precioCosteRamos == null ? 0 : compA.ramos[i].precioCosteRamos
        totalPrecioCosteRamosA += parseFloat(compA.ramos[i].precioCosteRamos);
        compB.ramos[i].precioCosteRamos = compB.ramos[i].precioCosteRamos == null ? 0 : compB.ramos[i].precioCosteRamos
        totalPrecioCosteRamosB += parseFloat(compB.ramos[i].precioCosteRamos);

        compA.ramos[i].importeFacturadoRamos = compA.ramos[i].importeFacturadoRamos == null ? 0 : compA.ramos[i].importeFacturadoRamos
        totalFacturadoRamosA += parseFloat(compA.ramos[i].importeFacturadoRamos);
        compB.ramos[i].importeFacturadoRamos = compB.ramos[i].importeFacturadoRamos == null ? 0 : compB.ramos[i].importeFacturadoRamos
        totalFacturadoRamosB += parseFloat(compB.ramos[i].importeFacturadoRamos);

        compA.ramos[i].margenSinIvaRamos = compA.ramos[i].margenSinIvaRamos == null ? 0 : compA.ramos[i].margenSinIvaRamos
        totalMargenRamosA += parseFloat(compA.ramos[i].margenSinIvaRamos);
        compB.ramos[i].margenSinIvaRamos = compB.ramos[i].margenSinIvaRamos == null ? 0 : compB.ramos[i].margenSinIvaRamos
        totalMargenRamosB += parseFloat(compB.ramos[i].margenSinIvaRamos);

        compA.cremaciones[i].cremaciones = compA.cremaciones[i].cremaciones == null ? 0 : compA.cremaciones[i].cremaciones
        totalCremacionesA += parseInt(compA.cremaciones[i].cremaciones);
        compB.cremaciones[i].cremaciones = compB.cremaciones[i].cremaciones == null ? 0 : compB.cremaciones[i].cremaciones
        totalCremacionesB += parseInt(compB.cremaciones[i].cremaciones);

        compA.cremaciones[i].precioCosteCremaciones = compA.cremaciones[i].precioCosteCremaciones == null ? 0 : compA.cremaciones[i].precioCosteCremaciones
        totalPrecioCosteCremacionesA += parseFloat(compA.cremaciones[i].precioCosteCremaciones);
        compB.cremaciones[i].precioCosteCremaciones = compB.cremaciones[i].precioCosteCremaciones == null ? 0 : compB.cremaciones[i].precioCosteCremaciones
        totalPrecioCosteCremacionesB += parseFloat(compB.cremaciones[i].precioCosteCremaciones);

        compA.cremaciones[i].importeFacturadoCremaciones = compA.cremaciones[i].importeFacturadoCremaciones == null ? 0 : compA.cremaciones[i].importeFacturadoCremaciones
        totalFacturadoCremacionesA += parseFloat(compA.cremaciones[i].importeFacturadoCremaciones);
        compB.cremaciones[i].importeFacturadoCremaciones = compB.cremaciones[i].importeFacturadoCremaciones == null ? 0 : compB.cremaciones[i].importeFacturadoCremaciones
        totalFacturadoCremacionesB += parseFloat(compB.cremaciones[i].importeFacturadoCremaciones);

        compA.cremaciones[i].margenSinIvaCremaciones = compA.cremaciones[i].margenSinIvaCremaciones == null ? 0 : compA.cremaciones[i].margenSinIvaCremaciones
        totalMargenCremacionesA += parseFloat(compA.cremaciones[i].margenSinIvaCremaciones);
        compB.cremaciones[i].margenSinIvaCremaciones = compB.cremaciones[i].margenSinIvaCremaciones == null ? 0 : compB.cremaciones[i].margenSinIvaCremaciones
        totalMargenCremacionesB += parseFloat(compB.cremaciones[i].margenSinIvaCremaciones);

        compA.numHombres[i] = compA.numHombres[i] == null ? 0 : compA.numHombres[i]
        totalNumHombresA += parseInt(compA.numHombres[i]);
        compA.edadMediaHombres[i] = compA.edadMediaHombres[i] == null ? 0 : compA.edadMediaHombres[i]
        totalEdadMediaHombresA +=  Math.round(compA.edadMediaHombres[i]);
        if(compA.edadMediaHombres[i] != 0){
            indexHombresA++;

        }
        compB.numHombres[i] = compB.numHombres[i] == null ? 0 : compB.numHombres[i]
        totalNumHombresA += parseInt(compB.numHombres[i]);
        compB.edadMediaHombres[i] = compB.edadMediaHombres[i] == null ? 0 : compB.edadMediaHombres[i]
        totalEdadMediaHombresA +=  Math.round(compB.edadMediaHombres[i]);
        if(compB.edadMediaHombres[i] != 0){
            indexHombresB++;
        }

        compB.numMujeres[i] = compB.numMujeres[i] == null ? 0 : compB.numMujeres[i]
        totalNumMujeresA += parseInt(compB.numMujeres[i]);
        compB.edadMediaMujeres[i] = compB.edadMediaMujeres[i] == null ? 0 : compB.edadMediaMujeres[i]
        totalEdadMediaMujeresA +=  Math.round(compB.edadMediaMujeres[i]);
        if(compB.edadMediaMujeres[i] != 0){
            indexMujeresA++;
        }

        compA.numMujeres[i] = compA.numMujeres[i] == null ? 0 : compA.numMujeres[i]
        totalNumMujeresB += parseInt(compA.numMujeres[i]);
        compA.edadMediaMujeres[i] = compA.edadMediaMujeres[i] == null ? 0 : compA.edadMediaMujeres[i]
        totalEdadMediaMujeresB +=  Math.round(compA.edadMediaMujeres[i]);
        if(compA.edadMediaMujeres[i] != 0){
            indexMujeresB++;
        }

        compA.baseImponible[i].baseImponible = compA.baseImponible[i].baseImponible == null ? 0 : compA.baseImponible[i].baseImponible
        totalBaseImponibleA += parseFloat(compA.baseImponible[i].baseImponible)
        if(compA.baseImponible[i].baseImponible > 0){
            indexBaseImponibleA++;
        }
        compB.baseImponible[i].baseImponible = compB.baseImponible[i].baseImponible == null ? 0 : compB.baseImponible[i].baseImponible
        totalBaseImponibleB += parseFloat(compB.baseImponible[i].baseImponible)
        if(compB.baseImponible[i].baseImponible > 0){
            indexBaseImponibleB++;
        }

        compA.margenBruto[i].margenBruto = compA.margenBruto[i].margenBruto == null ? 0 : compA.margenBruto[i].margenBruto
        totalMargenBrutoA += parseFloat(compA.margenBruto[i].margenBruto)
        compB.margenBruto[i].margenBruto = compB.margenBruto[i].margenBruto == null ? 0 : compB.margenBruto[i].margenBruto
        totalMargenBrutoB += parseFloat(compB.margenBruto[i].margenBruto)

        compA.totalFacturado[i].totalFacturado = compA.totalFacturado[i].totalFacturado == null ? 0 : compA.totalFacturado[i].totalFacturado
        totalTotalFacturacionA += parseFloat(compA.totalFacturado[i].totalFacturado)
        compB.totalFacturado[i].totalFacturado = compB.totalFacturado[i].totalFacturado == null ? 0 : compB.totalFacturado[i].totalFacturado
        totalTotalFacturacionA += parseFloat(compB.totalFacturado[i].totalFacturado)
        
        compA.tiempoCobro[i].tiempoCobro = compA.tiempoCobro[i].tiempoCobro == null ? '-' : compA.tiempoCobro[i].tiempoCobro
      
        var secondsCobroA = 0;
        if(compA.tiempoCobro[i].tiempoCobro != '-'){
            sumCobroA = compA.tiempoCobro[i].tiempoCobro;
            indexTiempoCobroA++;
        }

        compB.tiempoCobro[i].tiempoCobro = compB.tiempoCobro[i].tiempoCobro == null ? '-' : compB.tiempoCobro[i].tiempoCobro
        var secondsCobroB = 0;
        if(compB.tiempoCobro[i].tiempoCobro != '-'){
            sumCobroB = compB.tiempoCobro[i].tiempoCobro;
            indexTiempoCobroB++;
        }

        var auxTimeRespuestaA = 0;
        var auxHourRespuesta = 0;
        var secondsRespuestaA = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(compA.tiempoRespuesta[i] != 0){
            if(compA.tiempoRespuesta[i].length > 0){
                $.each(compA.tiempoRespuesta[i], function(index, elem){
                    var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var diff = arriveTime.getTime() - requestTime.getTime()
                    
                    //When arrive time is bigger than request time
                    if(diff < 0){ 
                        var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                        var arriveTime = new Date(arriveTimeAux)
                        var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                        var diff = arriveTime.getTime() - requestTime.getTime()
                    }

                    auxHourRespuestaAux = 0;
                    auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                    while(auxMinuteRespuestaAux >= 60){
                        auxHourRespuestaAux++;
                        auxMinuteRespuestaAux -= 60;
                    }

                    auxHourRespuesta += auxHourRespuestaAux;
                    auxMinuteRespuesta += auxMinuteRespuestaAux;
                })

                let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                let averageSeconds = seconds / compA.tiempoRespuesta[i].length
                secondsRespuestaA = averageSeconds;

                auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(auxMinuteRespuesta >= 60){
                    auxHourRespuesta += 1;
                    auxMinuteRespuesta -= 60;
                }

                hourRespuestaA += Math.floor((averageSeconds % 86400) / 3600);
                minuteRespuestaA += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(minuteRespuestaA >= 60){
                    hourRespuestaA += 1;
                    minuteRespuestaA -= 60;
                }

                auxTimeRespuestaA =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                indexTiempoRespuestaA++;
            }
        }

        var auxTimeRespuestaB = 0;
        var secondsRespuestaB = 0;
        var auxHourRespuesta = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(compB.tiempoRespuesta[i] != 0){
            if(compB.tiempoRespuesta[i].length > 0){
                $.each(compB.tiempoRespuesta[i], function(index, elem){
                    var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var diff = arriveTime.getTime() - requestTime.getTime()
                    
                    //When arrive time is bigger than request time
                    if(diff < 0){ 
                        var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                        var arriveTime = new Date(arriveTimeAux)
                        var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                        var diff = arriveTime.getTime() - requestTime.getTime()
                    }

                    auxHourRespuestaAux = 0;
                    auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                    while(auxMinuteRespuestaAux >= 60){
                        auxHourRespuestaAux++;
                        auxMinuteRespuestaAux -= 60;
                    }

                    auxHourRespuesta += auxHourRespuestaAux;
                    auxMinuteRespuesta += auxMinuteRespuestaAux;
                })

                let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                let averageSeconds = seconds / compB.tiempoRespuesta[i].length
                secondsRespuestaB = averageSeconds;

                auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(auxMinuteRespuesta >= 60){
                    auxHourRespuesta += 1;
                    auxMinuteRespuesta -= 60;
                }

                hourRespuestaB += Math.floor((averageSeconds % 86400) / 3600);
                minuteRespuestaB += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(minuteRespuestaB >= 60){
                    hourRespuestaB += 1;
                    minuteRespuestaB -= 60;
                }

                auxTimeRespuestaB =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                indexTiempoRespuestaB++;
            }
        }

        // CALCULAMOS LA DIFERENCIA DE LA COMPARACIÓN PARA CADA CAMPO Y TAMBIÉN SU INCREMENTO
        $content += '   <tr class="text-center">' +
                    '       <td style="white-space: nowrap;"><strong>' + compA.expedientes[i].name + '</strong></td>' +
                    '       <td>' + toFormatNumber(compA.expedientes[i].expedients) + '</td>'
        
        //EXPEDIENTES
        diffExpedients = parseFloat(compB.expedientes[i].expedients) - parseFloat(compA.expedientes[i].expedients)

        if(parseFloat(compA.expedientes[i].expedients) == 0){
            increExpedients = diffExpedients * 100
        }else{
            increExpedients = diffExpedients /  parseFloat(compA.expedientes[i].expedients) * 100
        }

        if(diffExpedients > 0){
            diffExpedients = "+" + toFormatNumber(parseFloat(diffExpedients).toFixed(2))
        }else{
            diffExpedients = toFormatNumber(parseFloat(diffExpedients).toFixed(2))
        }

        if(increExpedients == 0){
            $content += '       <td id="'+ compB.expedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(compB.expedientes[i].expedients) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span>' + toFormatNumber(increExpedients.toFixed(2)) + '%</span></td>'
        }else if(increExpedients > 0){
            $content += '       <td id="'+ compB.expedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(compB.expedientes[i].expedients) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(increExpedients.toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td id="'+ compB.expedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(compB.expedientes[i].expedients) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(increExpedients.toFixed(2)) + '%</span></td>'
        }

        //CORONAS
        $content += '       <td>' + toFormatNumber(parseInt(compA.coronas[i].coronas)) + '</td>'
        diffCoronas = parseInt(compB.coronas[i].coronas) - parseInt(compA.coronas[i].coronas)

        if(parseInt(compA.coronas[i].coronas) == 0){ 
            increCoronas = diffCoronas * 100
        }else{
            increCoronas = diffCoronas / parseInt(compA.coronas[i].coronas) * 100
        }

        if(diffCoronas > 0){
            diffCoronas = "+" + toFormatNumber(parseInt(diffCoronas).toFixed(2))
        }else{
            diffCoronas = toFormatNumber(parseInt(diffCoronas).toFixed(2))
        }

        if(increCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.coronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }else if(increCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.coronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.coronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }

        //PRECIO DE COSTE CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.coronas[i].precioCosteCoronas).toFixed(2)) + '</td>'
        diffPrecioCosteCoronas = parseFloat(compB.coronas[i].precioCosteCoronas) - parseFloat(compA.coronas[i].precioCosteCoronas)

        if(parseFloat(compA.coronas[i].precioCosteCoronas) == 0){
            increPrecioCosteCoronas = diffPrecioCosteCoronas * 100
        }else{
            increPrecioCosteCoronas = diffPrecioCosteCoronas / parseFloat(compA.coronas[i].precioCosteCoronas) * 100
        }

        if(diffPrecioCosteCoronas > 0){
            diffPrecioCosteCoronas = "+" + toFormatNumber(parseFloat(diffPrecioCosteCoronas).toFixed(2))
        }else{
            diffPrecioCosteCoronas = toFormatNumber(parseFloat(diffPrecioCosteCoronas).toFixed(2))
        }

        if(increPrecioCosteCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }


        //IMPORTE FACTURADO CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.coronas[i].importeFacturadoCoronas).toFixed(2)) + '</td>'
        diffImporteFacturadoCoronas = parseFloat(compB.coronas[i].importeFacturadoCoronas) - parseFloat(compA.coronas[i].importeFacturadoCoronas)

        if(parseFloat(compA.coronas[i].importeFacturadoCoronas) == 0){
            increImporteFacturadoCoronas = diffImporteFacturadoCoronas * 100
        }else{
            increImporteFacturadoCoronas = diffImporteFacturadoCoronas / parseFloat(compA.coronas[i].importeFacturadoCoronas) * 100
        }
        
        if(diffImporteFacturadoCoronas > 0){
            diffImporteFacturadoCoronas = "+" + toFormatNumber(parseFloat(diffImporteFacturadoCoronas).toFixed(2)) 
        }else{
            diffImporteFacturadoCoronas = toFormatNumber(parseFloat(diffImporteFacturadoCoronas).toFixed(2)) 
        }

        if(increImporteFacturadoCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.coronas[i].margenSinIvaCoronas).toFixed(2)) + '</td>'
        diffMargenSinIvaCoronas = parseFloat(compB.coronas[i].margenSinIvaCoronas) - parseFloat(compA.coronas[i].margenSinIvaCoronas)

        if(parseFloat(compA.coronas[i].margenSinIvaCoronas) == 0){
            increMargenSinIvaCoronas = diffMargenSinIvaCoronas * 100
        }else{
            increMargenSinIvaCoronas = diffMargenSinIvaCoronas / parseFloat(compA.coronas[i].margenSinIvaCoronas) * 100
        }

        if(diffMargenSinIvaCoronas > 0){
            diffMargenSinIvaCoronas = "+" + toFormatNumber(parseFloat(diffMargenSinIvaCoronas).toFixed(2))
        }else{
            diffMargenSinIvaCoronas = toFormatNumber(parseFloat(diffMargenSinIvaCoronas).toFixed(2))
        }

        if(increMargenSinIvaCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.coronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }

        //RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.ramos[i].ramos).toFixed(2)) + '</td>'
        diffRamos = parseFloat(compB.ramos[i].ramos) - parseFloat(compA.ramos[i].ramos)

        if(parseFloat(compA.ramos[i].ramos) == 0){
            increRamos = diffRamos * 100
        }else{
            increRamos = diffRamos / parseFloat(compA.ramos[i].ramos) * 100
        }

        if(diffRamos > 0){
            diffRamos = "+" + toFormatNumber(parseFloat(diffRamos).toFixed(2))
        }else{
            diffRamos = toFormatNumber(parseFloat(diffRamos).toFixed(2))
        }

        if(increRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }else if(increRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }

        //PRECIO DE COSTE RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.ramos[i].precioCosteRamos).toFixed(2)) + '</td>'
        diffPrecioCosteRamos = parseFloat(compB.ramos[i].precioCosteRamos) - parseFloat(compA.ramos[i].precioCosteRamos)

        if(parseFloat(compA.ramos[i].precioCosteRamos) == 0){
            increPrecioCosteRamos = diffPrecioCosteRamos * 100
        }else{
            increPrecioCosteRamos = diffPrecioCosteRamos / parseFloat(compA.ramos[i].precioCosteRamos) * 100
        }

        if(diffPrecioCosteRamos > 0){
            diffPrecioCosteRamos = "+" + toFormatNumber(parseFloat(diffPrecioCosteRamos).toFixed(2))
        }else{
            diffPrecioCosteRamos = toFormatNumber(parseFloat(diffPrecioCosteRamos).toFixed(2))
        }

        if(increPrecioCosteRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }

        //IMPORTE FACTURADO RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.ramos[i].importeFacturadoRamos).toFixed(2)) + '</td>'
        diffImporteFacturadoRamos = parseFloat(compB.ramos[i].importeFacturadoRamos) - parseFloat(compA.ramos[i].importeFacturadoRamos)

        if(parseFloat(compA.ramos[i].importeFacturadoRamos) == 0){
            increImporteFacturadoRamos = diffImporteFacturadoRamos * 100
        }else{
            increImporteFacturadoRamos = diffImporteFacturadoRamos / parseFloat(compA.ramos[i].importeFacturadoRamos) * 100
        }

        if(diffImporteFacturadoRamos > 0){
            diffImporteFacturadoRamos = "+" + toFormatNumber(parseFloat(diffImporteFacturadoRamos).toFixed(2))
        }else{
            diffImporteFacturadoRamos = toFormatNumber(parseFloat(diffImporteFacturadoRamos).toFixed(2))
        }

        if(increImporteFacturadoRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.ramos[i].margenSinIvaRamos).toFixed(2)) + '</td>'
        diffMargenSinIvaRamos = parseFloat(compB.ramos[i].margenSinIvaRamos) - parseFloat(compA.ramos[i].margenSinIvaRamos)

        if(parseFloat(compA.ramos[i].margenSinIvaRamos) == 0){
            increMargenSinIvaRamos = diffMargenSinIvaRamos * 100
        }else{
            increMargenSinIvaRamos = diffMargenSinIvaRamos / parseFloat(compA.ramos[i].margenSinIvaRamos) * 100
        }

        if(diffMargenSinIvaRamos > 0){
            diffMargenSinIvaRamos = "+" + toFormatNumber(parseFloat(diffMargenSinIvaRamos).toFixed(2))
        }else{
            diffMargenSinIvaRamos = toFormatNumber(parseFloat(diffMargenSinIvaRamos).toFixed(2))
        }

        if(increMargenSinIvaRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.ramos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }

        //CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.cremaciones[i].cremaciones).toFixed(2)) + '</td>'
        diffCremaciones = parseFloat(compB.cremaciones[i].cremaciones) - parseFloat(compA.cremaciones[i].cremaciones)

        if(parseFloat(compA.cremaciones[i].cremaciones) == 0){
            increCremaciones = diffCremaciones * 100
        }else{
            increCremaciones = diffCremaciones / parseFloat(compA.cremaciones[i].cremaciones) * 100
        }

        if(diffCremaciones > 0){
            diffCremaciones = "+" + toFormatNumber(parseFloat(diffCremaciones).toFixed(2))
        }else{
            diffCremaciones = toFormatNumber(parseFloat(diffCremaciones).toFixed(2))
        }

        if(increCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }

        //PRECIO DE COSTE CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.cremaciones[i].precioCosteCremaciones).toFixed(2)) + '</td>'
        diffPrecioCosteCremaciones = parseFloat(compB.cremaciones[i].precioCosteCremaciones) - parseFloat(compA.cremaciones[i].precioCosteCremaciones)

        if(parseFloat(compA.cremaciones[i].precioCosteCremaciones) == 0){
            increPrecioCosteCremaciones = diffPrecioCosteCremaciones * 100
        }else{
            increPrecioCosteCremaciones = diffPrecioCosteCremaciones / parseFloat(compA.cremaciones[i].precioCosteCremaciones) * 100
        }

        if(diffPrecioCosteCremaciones > 0){
            diffPrecioCosteCremaciones = "+" + toFormatNumber(parseFloat(diffPrecioCosteCremaciones).toFixed(2))
        }else{
            diffPrecioCosteCremaciones = toFormatNumber(parseFloat(diffPrecioCosteCremaciones).toFixed(2))
        }

        if(increPrecioCosteCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }

        //IMPORTE FACTURADO CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.cremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</td>'
        diffImporteFacturadoCremaciones = parseFloat(compB.cremaciones[i].importeFacturadoCremaciones) - parseFloat(compA.cremaciones[i].importeFacturadoCremaciones)

        if(parseFloat(compA.cremaciones[i].importeFacturadoCremaciones) == 0){
            increImporteFacturadoCremaciones = diffImporteFacturadoCremaciones * 100
        }else{
            increImporteFacturadoCremaciones = diffImporteFacturadoCremaciones / parseFloat(compA.cremaciones[i].importeFacturadoCremaciones) * 100
        }

        if(diffImporteFacturadoCremaciones > 0){
            diffImporteFacturadoCremaciones = "+" + toFormatNumber(parseFloat(diffImporteFacturadoCremaciones).toFixed(2))
        }else{
            diffImporteFacturadoCremaciones = toFormatNumber(parseFloat(diffImporteFacturadoCremaciones).toFixed(2))
        }

        if(increImporteFacturadoCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.cremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</td>'
        diffMargenSinIvaCremaciones = parseFloat(compB.cremaciones[i].margenSinIvaCremaciones) - parseFloat(compA.cremaciones[i].margenSinIvaCremaciones)

        if(parseFloat(compA.cremaciones[i].margenSinIvaCremaciones) == 0){
            increMargenSinIvaCremaciones = diffMargenSinIvaCremaciones * 100
        }else{
            increMargenSinIvaCremaciones = diffMargenSinIvaCremaciones / parseFloat(compA.cremaciones[i].margenSinIvaCremaciones) * 100
        }

        if(diffMargenSinIvaCremaciones > 0){
            diffMargenSinIvaCremaciones = "+" + toFormatNumber(parseFloat(diffMargenSinIvaCremaciones).toFixed(2))
        }else{
            diffMargenSinIvaCremaciones = toFormatNumber(parseFloat(diffMargenSinIvaCremaciones).toFixed(2))
        }

        if(increMargenSinIvaCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.cremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }

        //NUM HOMBRES
        $content += '       <td>' + toFormatNumber(parseInt(compA.numHombres[i])) + '</td>'
        diffNumHombres = parseInt(compB.numHombres[i]) - parseInt(compA.numHombres[i])

        if(parseInt(compA.numHombres[i]) == 0){
            increNumHombres = diffNumHombres * 100
        }else{
            increNumHombres = diffNumHombres / parseInt(compA.numHombres[i]) * 100
        }
        
        if(diffNumHombres > 0){
            diffNumHombres = "+" + parseInt(diffNumHombres)
        }else{
            diffNumHombres = parseInt(diffNumHombres)
        }

        if(increNumHombres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.numHombres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }else if(increNumHombres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.numHombres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.numHombres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }


        //EDAD MEDIA HOMBRES
        $content += '       <td>' + toFormatNumber(parseInt(compA.edadMediaHombres[i])) + '</td>'
        diffEdadMediaHombres = parseInt(compB.edadMediaHombres[i]) - parseInt(compA.edadMediaHombres[i])

        if(parseInt(compA.edadMediaHombres[i]) == 0){
            increEdadMediaHombres = diffEdadMediaHombres * 100
        }else{
            increEdadMediaHombres = diffEdadMediaHombres / parseInt(compA.edadMediaHombres[i]) * 100
        }

        if(diffEdadMediaHombres > 0){
            diffEdadMediaHombres = "+" + Math.round(diffEdadMediaHombres)
        }else{
            diffEdadMediaHombres = Math.round(diffEdadMediaHombres)
        }

        if(increEdadMediaHombres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.edadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increEdadMediaHombres)) + '%</span></td>'
        }else if(increEdadMediaHombres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.edadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span style="color:green">+' + Math.round(increEdadMediaHombres) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.edadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span style="color:red">' + Math.round(increEdadMediaHombres) + '%</span></td>'
        }

        //NUM MUJERES
        $content += '       <td>' + toFormatNumber(parseInt(compA.numMujeres[i])) + '</td>'
        diffNumMujeres = parseInt(compB.numMujeres[i]) - parseInt(compA.numMujeres[i])

        if(parseInt(compA.numMujeres[i]) == 0){
            increNumMujeres = diffNumMujeres * 100
        }else{
            increNumMujeres = diffNumMujeres / parseInt(compA.numMujeres[i]) * 100
        }

        if(diffNumMujeres > 0){
            diffNumMujeres = "+" + parseInt(diffNumMujeres)
        }else{
            diffNumMujeres = parseInt(diffNumMujeres)
        }

        if(increNumMujeres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.numMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }else if(increNumMujeres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.numMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.numMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }

        //EDAD MEDIA MUJERES
        $content += '       <td>' + toFormatNumber(parseInt(compA.edadMediaMujeres[i])) + '</td>'
        diffEdadMediaMujeres = parseInt(compB.edadMediaMujeres[i]) - parseInt(compA.edadMediaMujeres[i])

        if(parseInt(compA.edadMediaMujeres[i]) == 0){
            increEdadMediaMujeres = diffEdadMediaMujeres * 100
        }else{
            increEdadMediaMujeres = diffEdadMediaMujeres / parseInt(compA.edadMediaMujeres[i]) * 100
        }
        if(diffEdadMediaMujeres > 0){
            diffEdadMediaMujeres = "+" + Math.round(diffEdadMediaMujeres)
        }else{
            diffEdadMediaMujeres = "+" + Math.round(diffEdadMediaMujeres)
        }
        if(increEdadMediaMujeres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.edadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }else if(increEdadMediaMujeres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.edadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.edadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }

        //BASE IMPONIBLE
        $content += '       <td>' + toFormatNumber(parseFloat(compA.baseImponible[i].baseImponible).toFixed(2)) + '</td>'
        diffBaseImponible = parseFloat(compB.baseImponible[i].baseImponible) - parseFloat(compA.baseImponible[i].baseImponible)

        if(parseFloat(compA.baseImponible[i].baseImponible) == 0){
            increBaseImponible = diffBaseImponible * 100
        }else{
            increBaseImponible = diffBaseImponible / parseFloat(compA.baseImponible[i].baseImponible) * 100
        }

        if(diffBaseImponible > 0){
            diffBaseImponible = "+" +  toFormatNumber(parseFloat(diffBaseImponible).toFixed(2))
        }else{
            diffBaseImponible = toFormatNumber(parseFloat(diffBaseImponible).toFixed(2))
        }

        if(increBaseImponible == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.baseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }else if(increBaseImponible > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.baseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.baseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }

        //MARGEN BRUTO
        $content += '       <td>' + toFormatNumber(parseFloat(compA.margenBruto[i].margenBruto).toFixed(2)) + '</td>'
        diffMargenBruto = parseFloat(compB.margenBruto[i].margenBruto) - parseFloat(compA.margenBruto[i].margenBruto)

        if(parseFloat(compA.margenBruto[i].margenBruto) == 0){
            increMargenBruto = diffMargenBruto * 100
        }else{
            increMargenBruto = diffMargenBruto / parseFloat(compA.margenBruto[i].margenBruto) * 100
        }
        if(diffMargenBruto > 0){
            diffMargenBruto = "+" + toFormatNumber(parseFloat(diffMargenBruto).toFixed(2))
        }else{
            diffMargenBruto = toFormatNumber(parseFloat(diffMargenBruto).toFixed(2))
        }

        if(increMargenBruto == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.margenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }else if(increMargenBruto > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.margenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.margenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }

        //TOTAL FACTURADO
        $content += '       <td>' + toFormatNumber(parseFloat(compA.totalFacturado[i].totalFacturado).toFixed(2)) + '</td>'
        diffTotalFacturado = parseFloat(compB.totalFacturado[i].totalFacturado) - parseFloat(compA.totalFacturado[i].totalFacturado)

        if(parseFloat(compA.totalFacturado[i].totalFacturado) == 0){
            increTotalFacturado = diffTotalFacturado * 100
        }else{
            increTotalFacturado = diffTotalFacturado / parseFloat(compA.totalFacturado[i].totalFacturado) * 100
        }
        if(diffTotalFacturado > 0){
            diffTotalFacturado = "+" + toFormatNumber(parseFloat(diffTotalFacturado).toFixed(2))
        }else{
            diffTotalFacturado = toFormatNumber(parseFloat(diffTotalFacturado).toFixed(2))
        }

        if(increTotalFacturado == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.totalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }else if(increTotalFacturado > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.totalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.totalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }

        //TIEMPO COBRO
        if(sumCobroA == 0){
            $content += '       <td>-</td>'
        }else{
            $content += '       <td>' + parseFloat(sumCobroA).toFixed(2) + '</td>'
        }
        diffTiempoCobro = parseFloat(parseFloat(sumCobroB) - parseFloat(sumCobroA)).toFixed(2);

        if(diffTiempoCobro == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span>(-)</span></td>'
        }else if(diffTiempoCobro > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span style="color:red">(+ ' + parseFloat(diffTiempoCobro).toFixed(2) + ')</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span style="color:green">(' + parseFloat(diffTiempoCobro).toFixed(2) + ')</span></td>'
        }
        
        //TIEMPO RESPUESTA
        $content += '       <td>' + (auxTimeRespuestaA == 0 ? '-' :auxTimeRespuestaA)  + '</td>'
        diffTiempoRespuesta = secondsRespuestaB - secondsRespuestaA

        diffHourRespuesta = parseInt((diffTiempoRespuesta % 86400) / 3600);
        diffMinuteRespuesta = parseInt(((diffTiempoRespuesta % 86400) % 3600) / 60);
        while(diffMinuteRespuesta >= 60){
            diffHourRespuesta += 1;
            diffMinuteRespuesta -= 60;
        }

        diffTiempoRespuestaFinal = diffHourRespuesta + "h " + diffMinuteRespuesta + "min" 
        
        if(diffTiempoRespuestaFinal == '0h 0min' || (secondsRespuestaB == 0 && secondsRespuestaA == 0)){
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span>(-)</span></td>'
        }else if(diffTiempoRespuesta > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span style="color:red">(+ ' + diffTiempoRespuestaFinal + ')</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span style="color:green">(-' + String(diffTiempoRespuestaFinal).replace("-"," ").replace("-","") + ')</span></td>'
        }
    }
    

    for (var i = 0; i < compA.particularesCoronas.length; i++) {
        
        totalExpedientsA += parseInt(compA.particularesExpedientes[i].expedients);
        totalExpedientsB += parseInt(compB.particularesExpedientes[i].expedients);
   
        compA.particularesCoronas[i].coronas =compA.particularesCoronas[i].coronas == null ? 0 :compA.particularesCoronas[i].coronas
        totalCoronasA += parseInt(compA.particularesCoronas[i].coronas);
        compB.particularesCoronas[i].coronas =compB.particularesCoronas[i].coronas == null ? 0 :compB.particularesCoronas[i].coronas
        totalCoronasB += parseInt(compB.particularesCoronas[i].coronas);

        compA.particularesCoronas[i].precioCosteCoronas =compA.particularesCoronas[i].precioCosteCoronas == null ? 0 :compA.particularesCoronas[i].precioCosteCoronas
        totalPrecioCosteCoronasA += parseFloat(compA.particularesCoronas[i].precioCosteCoronas);
        compB.particularesCoronas[i].precioCosteCoronas =compB.particularesCoronas[i].precioCosteCoronas == null ? 0 :compB.particularesCoronas[i].precioCosteCoronas
        totalPrecioCosteCoronasB += parseFloat(compB.particularesCoronas[i].precioCosteCoronas);

        compA.particularesCoronas[i].importeFacturadoCoronas =compA.particularesCoronas[i].importeFacturadoCoronas == null ? 0 :compA.particularesCoronas[i].importeFacturadoCoronas
        totalFacturadoCoronasA += parseFloat(compA.particularesCoronas[i].importeFacturadoCoronas);
        compB.particularesCoronas[i].importeFacturadoCoronas =compB.particularesCoronas[i].importeFacturadoCoronas == null ? 0 :compB.particularesCoronas[i].importeFacturadoCoronas
        totalFacturadoCoronasB += parseFloat(compB.particularesCoronas[i].importeFacturadoCoronas);

        compA.particularesCoronas[i].margenSinIvaCoronas =compA.particularesCoronas[i].margenSinIvaCoronas == null ? 0 :compA.particularesCoronas[i].margenSinIvaCoronas
        totalMargenCoronasA += parseFloat(compA.particularesCoronas[i].margenSinIvaCoronas);
        compB.particularesCoronas[i].margenSinIvaCoronas =compB.particularesCoronas[i].margenSinIvaCoronas == null ? 0 :compB.particularesCoronas[i].margenSinIvaCoronas
        totalMargenCoronasB += parseFloat(compB.particularesCoronas[i].margenSinIvaCoronas);

        compA.particularesRamos[i].ramos = compA.particularesRamos[i].ramos == null ? 0 : compA.particularesRamos[i].ramos
        totalRamosA += parseInt(compA.particularesRamos[i].ramos);
        compB.particularesRamos[i].ramos = compB.particularesRamos[i].ramos == null ? 0 : compB.particularesRamos[i].ramos
        totalRamosB += parseInt(compB.particularesRamos[i].ramos);

        compA.particularesRamos[i].precioCosteRamos = compA.particularesRamos[i].precioCosteRamos == null ? 0 : compA.particularesRamos[i].precioCosteRamos
        totalPrecioCosteRamosA += parseFloat(compA.particularesRamos[i].precioCosteRamos);
        compB.particularesRamos[i].precioCosteRamos = compB.particularesRamos[i].precioCosteRamos == null ? 0 : compB.particularesRamos[i].precioCosteRamos
        totalPrecioCosteRamosB += parseFloat(compB.particularesRamos[i].precioCosteRamos);

        compA.particularesRamos[i].importeFacturadoRamos = compA.particularesRamos[i].importeFacturadoRamos == null ? 0 : compA.particularesRamos[i].importeFacturadoRamos
        totalFacturadoRamosA += parseFloat(compA.particularesRamos[i].importeFacturadoRamos);
        compB.particularesRamos[i].importeFacturadoRamos = compB.particularesRamos[i].importeFacturadoRamos == null ? 0 : compB.particularesRamos[i].importeFacturadoRamos
        totalFacturadoRamosB += parseFloat(compB.particularesRamos[i].importeFacturadoRamos);

        compA.particularesRamos[i].margenSinIvaRamos = compA.particularesRamos[i].margenSinIvaRamos == null ? 0 : compA.particularesRamos[i].margenSinIvaRamos
        totalMargenRamosA += parseFloat(compA.particularesRamos[i].margenSinIvaRamos);
        compB.particularesRamos[i].margenSinIvaRamos = compB.particularesRamos[i].margenSinIvaRamos == null ? 0 : compB.particularesRamos[i].margenSinIvaRamos
        totalMargenRamosB += parseFloat(compB.particularesRamos[i].margenSinIvaRamos);

        compA.particularesCremaciones[i].cremaciones = compA.particularesCremaciones[i].cremaciones == null ? 0 : compA.particularesCremaciones[i].cremaciones
        totalCremacionesA += parseInt(compA.particularesCremaciones[i].cremaciones);
        compB.particularesCremaciones[i].cremaciones = compB.particularesCremaciones[i].cremaciones == null ? 0 : compB.particularesCremaciones[i].cremaciones
        totalCremacionesB += parseInt(compB.particularesCremaciones[i].cremaciones);

        compA.particularesCremaciones[i].precioCosteCremaciones = compA.particularesCremaciones[i].precioCosteCremaciones == null ? 0 : compA.particularesCremaciones[i].precioCosteCremaciones
        totalPrecioCosteCremacionesA += parseFloat(compA.particularesCremaciones[i].precioCosteCremaciones);
        compB.particularesCremaciones[i].precioCosteCremaciones = compB.particularesCremaciones[i].precioCosteCremaciones == null ? 0 : compB.particularesCremaciones[i].precioCosteCremaciones
        totalPrecioCosteCremacionesB += parseFloat(compB.particularesCremaciones[i].precioCosteCremaciones);

        compA.particularesCremaciones[i].importeFacturadoCremaciones = compA.particularesCremaciones[i].importeFacturadoCremaciones == null ? 0 : compA.particularesCremaciones[i].importeFacturadoCremaciones
        totalFacturadoCremacionesA += parseFloat(compA.particularesCremaciones[i].importeFacturadoCremaciones);
        compB.particularesCremaciones[i].importeFacturadoCremaciones = compB.particularesCremaciones[i].importeFacturadoCremaciones == null ? 0 : compB.particularesCremaciones[i].importeFacturadoCremaciones
        totalFacturadoCremacionesB += parseFloat(compB.particularesCremaciones[i].importeFacturadoCremaciones);

        compA.particularesCremaciones[i].margenSinIvaCremaciones = compA.particularesCremaciones[i].margenSinIvaCremaciones == null ? 0 : compA.particularesCremaciones[i].margenSinIvaCremaciones
        totalMargenCremacionesA += parseFloat(compA.particularesCremaciones[i].margenSinIvaCremaciones);
        compB.particularesCremaciones[i].margenSinIvaCremaciones = compB.particularesCremaciones[i].margenSinIvaCremaciones == null ? 0 : compB.particularesCremaciones[i].margenSinIvaCremaciones
        totalMargenCremacionesB += parseFloat(compB.particularesCremaciones[i].margenSinIvaCremaciones);

        compA.particularesNumHombres[i] = compA.particularesNumHombres[i] == null ? 0 : compA.particularesNumHombres[i]
        totalNumHombresA += parseInt(compA.particularesNumHombres[i]);
        compA.particularesEdadMediaHombres[i] = compA.particularesEdadMediaHombres[i] == null ? 0 : compA.particularesEdadMediaHombres[i]
        totalEdadMediaHombresA +=  Math.round(compA.particularesEdadMediaHombres[i]);
        if(compA.particularesEdadMediaHombres[i] != 0){
            indexHombresA++;

        }
        compB.particularesNumHombres[i] = compB.particularesNumHombres[i] == null ? 0 : compB.particularesNumHombres[i]
        totalNumHombresA += parseInt(compB.particularesNumHombres[i]);
        compB.particularesEdadMediaHombres[i] = compB.particularesEdadMediaHombres[i] == null ? 0 : compB.particularesEdadMediaHombres[i]
        totalEdadMediaHombresA +=  Math.round(compB.particularesEdadMediaHombres[i]);
        if(compB.particularesEdadMediaHombres[i] != 0){
            indexHombresB++;
        }

        compB.particularesNumMujeres[i] = compB.particularesNumMujeres[i] == null ? 0 : compB.particularesNumMujeres[i]
        totalNumMujeresA += parseInt(compB.particularesNumMujeres[i]);
        compB.particularesEdadMediaMujeres[i] = compB.particularesEdadMediaMujeres[i] == null ? 0 : compB.particularesEdadMediaMujeres[i]
        totalEdadMediaMujeresA +=  Math.round(compB.particularesEdadMediaMujeres[i]);
        if(compB.particularesEdadMediaMujeres[i] != 0){
            indexMujeresA++;
        }

        compA.particularesNumMujeres[i] = compA.particularesNumMujeres[i] == null ? 0 : compA.particularesNumMujeres[i]
        totalNumMujeresB += parseInt(compA.particularesNumMujeres[i]);
        compA.particularesEdadMediaMujeres[i] = compA.particularesEdadMediaMujeres[i] == null ? 0 : compA.particularesEdadMediaMujeres[i]
        totalEdadMediaMujeresB +=  Math.round(compA.particularesEdadMediaMujeres[i]);
        if(compA.particularesEdadMediaMujeres[i] != 0){
            indexMujeresB++;
        }

        compA.particularesBaseImponible[i].baseImponible = compA.particularesBaseImponible[i].baseImponible == null ? 0 : compA.particularesBaseImponible[i].baseImponible
        totalBaseImponibleA += parseFloat(compA.particularesBaseImponible[i].baseImponible)
        if(compA.particularesBaseImponible[i].baseImponible > 0){
            indexBaseImponibleA++;
        }
        compB.particularesBaseImponible[i].baseImponible = compB.particularesBaseImponible[i].baseImponible == null ? 0 : compB.particularesBaseImponible[i].baseImponible
        totalBaseImponibleB += parseFloat(compB.particularesBaseImponible[i].baseImponible)
        if(compB.particularesBaseImponible[i].baseImponible > 0){
            indexBaseImponibleB++;
        }

        compA.particularesMargenBruto[i].margenBruto = compA.particularesMargenBruto[i].margenBruto == null ? 0 : compA.particularesMargenBruto[i].margenBruto
        totalMargenBrutoA += parseFloat(compA.particularesMargenBruto[i].margenBruto)
        compB.particularesMargenBruto[i].margenBruto = compB.particularesMargenBruto[i].margenBruto == null ? 0 : compB.particularesMargenBruto[i].margenBruto
        totalMargenBrutoB += parseFloat(compB.particularesMargenBruto[i].margenBruto)

        compA.particularesTotalFacturado[i].totalFacturado = compA.particularesTotalFacturado[i].totalFacturado == null ? 0 : compA.particularesTotalFacturado[i].totalFacturado
        totalTotalFacturacionA += parseFloat(compA.particularesTotalFacturado[i].totalFacturado)
        compB.particularesTotalFacturado[i].totalFacturado = compB.particularesTotalFacturado[i].totalFacturado == null ? 0 : compB.particularesTotalFacturado[i].totalFacturado
        totalTotalFacturacionA += parseFloat(compB.particularesTotalFacturado[i].totalFacturado)
        
        compA.particularesTiempoCobro[i].tiempoCobro = compA.particularesTiempoCobro[i].tiempoCobro == null ? '-' : compA.particularesTiempoCobro[i].tiempoCobro
        var auxHourCobroA = 0;
        var auxMinuteCobroA = 0;
        var auxTimeCobroA = '-';
        var secondsCobroA = 0;
        var sumCobroA = 0;
        var sumCobroB = 0;
        if(compA.particularesTiempoCobro[i].tiempoCobro != '-'){
            sumCobroA = compA.particularesTiempoCobro[i].tiempoCobro
        }

        compB.particularesTiempoCobro[i].tiempoCobro = compB.particularesTiempoCobro[i].tiempoCobro == null ? '-' : compB.particularesTiempoCobro[i].tiempoCobro
        var auxHourCobroB = 0;
        var auxMinuteCobroB = 0;
        var auxTimeCobroB = '-';
        var secondsCobroB = 0;
        if(compB.particularesTiempoCobro[i].tiempoCobro != '-'){
            sumCobroB = compB.particularesTiempoCobro[i].tiempoCobro
        }

        var auxTimeRespuestaA = 0;
        var auxHourRespuesta = 0;
        var secondsRespuestaA = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(compA.particularesTiempoRespuesta[i] != 0){
            if(compA.particularesTiempoRespuesta[i].length > 0){
                $.each(compA.particularesTiempoRespuesta[i], function(index, elem){
                    var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var diff = arriveTime.getTime() - requestTime.getTime()
                    
                    //When arrive time is bigger than request time
                    if(diff < 0){ 
                        var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                        var arriveTime = new Date(arriveTimeAux)
                        var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                        var diff = arriveTime.getTime() - requestTime.getTime()
                    }

                    auxHourRespuestaAux = 0;
                    auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                    while(auxMinuteRespuestaAux >= 60){
                        auxHourRespuestaAux++;
                        auxMinuteRespuestaAux -= 60;
                    }

                    auxHourRespuesta += auxHourRespuestaAux;
                    auxMinuteRespuesta += auxMinuteRespuestaAux;
                })

                let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                let averageSeconds = seconds / compA.particularesTiempoRespuesta[i].length
                secondsRespuestaA = averageSeconds;

                auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(auxMinuteRespuesta >= 60){
                    auxHourRespuesta += 1;
                    auxMinuteRespuesta -= 60;
                }

                hourRespuestaA += Math.floor((averageSeconds % 86400) / 3600);
                minuteRespuestaA += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(minuteRespuestaA >= 60){
                    hourRespuestaA += 1;
                    minuteRespuestaA -= 60;
                }

                auxTimeRespuestaA =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                indexTiempoRespuestaA++;
            }
        }

        var auxTimeRespuestaB = 0;
        var secondsRespuestaB = 0;
        var auxHourRespuesta = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(compB.particularesTiempoRespuesta[i] != 0){
            if(compB.particularesTiempoRespuesta[i].length > 0){
                $.each(compB.particularesTiempoRespuesta[i], function(index, elem){
                    var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var diff = arriveTime.getTime() - requestTime.getTime()
                    
                    //When arrive time is bigger than request time
                    if(diff < 0){ 
                        var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                        var arriveTime = new Date(arriveTimeAux)
                        var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                        var diff = arriveTime.getTime() - requestTime.getTime()
                    }

                    auxHourRespuestaAux = 0;
                    auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                    while(auxMinuteRespuestaAux >= 60){
                        auxHourRespuestaAux++;
                        auxMinuteRespuestaAux -= 60;
                    }

                    auxHourRespuesta += auxHourRespuestaAux;
                    auxMinuteRespuesta += auxMinuteRespuestaAux;
                })

                let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                let averageSeconds = seconds / compB.particularesTiempoRespuesta[i].length
                secondsRespuestaB = averageSeconds;

                auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(auxMinuteRespuesta >= 60){
                    auxHourRespuesta += 1;
                    auxMinuteRespuesta -= 60;
                }

                hourRespuestaB += Math.floor((averageSeconds % 86400) / 3600);
                minuteRespuestaB += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(minuteRespuestaB >= 60){
                    hourRespuestaB += 1;
                    minuteRespuestaB -= 60;
                }

                auxTimeRespuestaB =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                indexTiempoRespuestaB++;
            }
        }

        // CALCULAMOS LA DIFERENCIA DE LA COMPARACIÓN PARA CADA CAMPO Y TAMBIÉN SU INCREMENTO
        $content += '   <tr class="text-center">' +
                    '       <td style="white-space: nowrap;"><strong>Particulares</strong></td>' +
                    '       <td>' + toFormatNumber(compA.particularesExpedientes[i].expedients) + '</td>'
    
        //EXPEDIENTES
        diffExpedients = parseFloat(compB.particularesExpedientes[i].expedients) - parseFloat(compA.particularesExpedientes[i].expedients)
        if(parseFloat(compA.particularesExpedientes[i].expedients) == 0){
            increExpedients = diffExpedients * 100
        }else{
            increExpedients = diffExpedients /  parseFloat(compA.particularesExpedientes[i].expedients) * 100
        }

        if(diffExpedients > 0){
            diffExpedients = "+" + toFormatNumber(parseInt(diffExpedients))
        }else{
            diffExpedients = toFormatNumber(parseInt(diffExpedients))
        }

        if(increExpedients == 0){
            $content += '       <td id="'+ compB.particularesExpedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(parseInt(compB.particularesExpedientes[i].expedients)) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increExpedients).toFixed(2)) + '%</span></td>'
        }else if(increExpedients > 0){
            $content += '       <td id="'+ compB.particularesExpedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(parseInt(compB.particularesExpedientes[i].expedients)) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increExpedients).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td id="'+ compB.particularesExpedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(parseInt(compB.particularesExpedientes[i].expedients)) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increExpedients).toFixed(2)) + '%</span></td>'
        }

        //CORONAS
        $content += '       <td>' + toFormatNumber(parseInt(compA.particularesCoronas[i].coronas)) + '</td>'
        diffCoronas = parseInt(compB.particularesCoronas[i].coronas) - parseInt(compA.particularesCoronas[i].coronas)

        if(parseInt(compA.particularesCoronas[i].coronas) == 0){ 
            increCoronas = diffCoronas * 100
        }else{
            increCoronas = diffCoronas / parseInt(compA.particularesCoronas[i].coronas) * 100
        }

        if(diffCoronas > 0){
            diffCoronas = "+" + toFormatNumber(parseInt(diffCoronas).toFixed(2))
        }else{
            diffCoronas = toFormatNumber(parseInt(diffCoronas).toFixed(2))
        }

        if(increCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesCoronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }else if(increCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesCoronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesCoronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }

        //PRECIO DE COSTE CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCoronas[i].precioCosteCoronas).toFixed(2)) + '</td>'
        diffPrecioCosteCoronas = parseFloat(compB.particularesCoronas[i].precioCosteCoronas) - parseFloat(compA.particularesCoronas[i].precioCosteCoronas)

        if(parseFloat(compA.particularesCoronas[i].precioCosteCoronas) == 0){
            increPrecioCosteCoronas = diffPrecioCosteCoronas * 100
        }else{
            increPrecioCosteCoronas = diffPrecioCosteCoronas / parseFloat(compA.particularesCoronas[i].precioCosteCoronas) * 100
        }

        if(diffPrecioCosteCoronas > 0){
            diffPrecioCosteCoronas = "+" + toFormatNumber(parseFloat(diffPrecioCosteCoronas).toFixed(2))
        }else{
            diffPrecioCosteCoronas = toFormatNumber(parseFloat(diffPrecioCosteCoronas).toFixed(2))
        }

        if(increPrecioCosteCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }


        //IMPORTE FACTURADO CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</td>'
        diffImporteFacturadoCoronas = parseFloat(compB.particularesCoronas[i].importeFacturadoCoronas) - parseFloat(compA.particularesCoronas[i].importeFacturadoCoronas)

        if(parseFloat(compA.particularesCoronas[i].importeFacturadoCoronas) == 0){
            increImporteFacturadoCoronas = diffImporteFacturadoCoronas * 100
        }else{
            increImporteFacturadoCoronas = diffImporteFacturadoCoronas / parseFloat(compA.particularesCoronas[i].importeFacturadoCoronas) * 100
        }
        
        if(diffImporteFacturadoCoronas > 0){
            diffImporteFacturadoCoronas = "+" + toFormatNumber(parseFloat(diffImporteFacturadoCoronas).toFixed(2)) 
        }else{
            diffImporteFacturadoCoronas = toFormatNumber(parseFloat(diffImporteFacturadoCoronas).toFixed(2)) 
        }

        if(increImporteFacturadoCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</td>'
        diffMargenSinIvaCoronas = parseFloat(compB.particularesCoronas[i].margenSinIvaCoronas) - parseFloat(compA.particularesCoronas[i].margenSinIvaCoronas)

        if(parseFloat(compA.particularesCoronas[i].margenSinIvaCoronas) == 0){
            increMargenSinIvaCoronas = diffMargenSinIvaCoronas * 100
        }else{
            increMargenSinIvaCoronas = diffMargenSinIvaCoronas / parseFloat(compA.particularesCoronas[i].margenSinIvaCoronas) * 100
        }

        if(diffMargenSinIvaCoronas > 0){
            diffMargenSinIvaCoronas = "+" + toFormatNumber(parseFloat(diffMargenSinIvaCoronas).toFixed(2))
        }else{
            diffMargenSinIvaCoronas = toFormatNumber(parseFloat(diffMargenSinIvaCoronas).toFixed(2))
        }

        if(increMargenSinIvaCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }

        //RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesRamos[i].ramos).toFixed(2)) + '</td>'
        diffRamos = parseFloat(compB.particularesRamos[i].ramos) - parseFloat(compA.particularesRamos[i].ramos)

        if(parseFloat(compA.particularesRamos[i].ramos) == 0){
            increRamos = diffRamos * 100
        }else{
            increRamos = diffRamos / parseFloat(compA.particularesRamos[i].ramos) * 100
        }

        if(diffRamos > 0){
            diffRamos = "+" + toFormatNumber(parseFloat(diffRamos).toFixed(2))
        }else{
            diffRamos = toFormatNumber(parseFloat(diffRamos).toFixed(2))
        }

        if(increRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }else if(increRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }

        //PRECIO DE COSTE RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesRamos[i].precioCosteRamos).toFixed(2)) + '</td>'
        diffPrecioCosteRamos = parseFloat(compB.particularesRamos[i].precioCosteRamos) - parseFloat(compA.particularesRamos[i].precioCosteRamos)

        if(parseFloat(compA.particularesRamos[i].precioCosteRamos) == 0){
            increPrecioCosteRamos = diffPrecioCosteRamos * 100
        }else{
            increPrecioCosteRamos = diffPrecioCosteRamos / parseFloat(compA.particularesRamos[i].precioCosteRamos) * 100
        }

        if(diffPrecioCosteRamos > 0){
            diffPrecioCosteRamos = "+" + toFormatNumber(parseFloat(diffPrecioCosteRamos).toFixed(2))
        }else{
            diffPrecioCosteRamos = toFormatNumber(parseFloat(diffPrecioCosteRamos).toFixed(2))
        }

        if(increPrecioCosteRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }

        //IMPORTE FACTURADO RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesRamos[i].importeFacturadoRamos).toFixed(2)) + '</td>'
        diffImporteFacturadoRamos = parseFloat(compB.particularesRamos[i].importeFacturadoRamos) - parseFloat(compA.particularesRamos[i].importeFacturadoRamos)

        if(parseFloat(compA.particularesRamos[i].importeFacturadoRamos) == 0){
            increImporteFacturadoRamos = diffImporteFacturadoRamos * 100
        }else{
            increImporteFacturadoRamos = diffImporteFacturadoRamos / parseFloat(compA.particularesRamos[i].importeFacturadoRamos) * 100
        }

        if(diffImporteFacturadoRamos > 0){
            diffImporteFacturadoRamos = "+" + toFormatNumber(parseFloat(diffImporteFacturadoRamos).toFixed(2))
        }else{
            diffImporteFacturadoRamos = toFormatNumber(parseFloat(diffImporteFacturadoRamos).toFixed(2))
        }

        if(increImporteFacturadoRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesRamos[i].margenSinIvaRamos).toFixed(2)) + '</td>'
        diffMargenSinIvaRamos = parseFloat(compB.particularesRamos[i].margenSinIvaRamos) - parseFloat(compA.particularesRamos[i].margenSinIvaRamos)

        if(parseFloat(compA.particularesRamos[i].margenSinIvaRamos) == 0){
            increMargenSinIvaRamos = diffMargenSinIvaRamos * 100
        }else{
            increMargenSinIvaRamos = diffMargenSinIvaRamos / parseFloat(compA.particularesRamos[i].margenSinIvaRamos) * 100
        }

        if(diffMargenSinIvaRamos > 0){
            diffMargenSinIvaRamos = "+" + toFormatNumber(parseFloat(diffMargenSinIvaRamos).toFixed(2))
        }else{
            diffMargenSinIvaRamos = toFormatNumber(parseFloat(diffMargenSinIvaRamos).toFixed(2))
        }

        if(increMargenSinIvaRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesRamos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }

        //CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCremaciones[i].cremaciones).toFixed(2)) + '</td>'
        diffCremaciones = parseFloat(compB.particularesCremaciones[i].cremaciones) - parseFloat(compA.particularesCremaciones[i].cremaciones)

        if(parseFloat(compA.particularesCremaciones[i].cremaciones) == 0){
            increCremaciones = diffCremaciones * 100
        }else{
            increCremaciones = diffCremaciones / parseFloat(compA.particularesCremaciones[i].cremaciones) * 100
        }

        if(diffCremaciones > 0){
            diffCremaciones = "+" + toFormatNumber(parseFloat(diffCremaciones).toFixed(2))
        }else{
            diffCremaciones = toFormatNumber(parseFloat(diffCremaciones).toFixed(2))
        }

        if(increCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }

        //PRECIO DE COSTE CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</td>'
        diffPrecioCosteCremaciones = parseFloat(compB.particularesCremaciones[i].precioCosteCremaciones) - parseFloat(compA.particularesCremaciones[i].precioCosteCremaciones)

        if(parseFloat(compA.particularesCremaciones[i].precioCosteCremaciones) == 0){
            increPrecioCosteCremaciones = diffPrecioCosteCremaciones * 100
        }else{
            increPrecioCosteCremaciones = diffPrecioCosteCremaciones / parseFloat(compA.particularesCremaciones[i].precioCosteCremaciones) * 100
        }

        if(diffPrecioCosteCremaciones > 0){
            diffPrecioCosteCremaciones = "+" + toFormatNumber(parseFloat(diffPrecioCosteCremaciones).toFixed(2))
        }else{
            diffPrecioCosteCremaciones = toFormatNumber(parseFloat(diffPrecioCosteCremaciones).toFixed(2))
        }

        if(increPrecioCosteCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }

        //IMPORTE FACTURADO CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</td>'
        diffImporteFacturadoCremaciones = parseFloat(compB.particularesCremaciones[i].importeFacturadoCremaciones) - parseFloat(compA.particularesCremaciones[i].importeFacturadoCremaciones)

        if(parseFloat(compA.particularesCremaciones[i].importeFacturadoCremaciones) == 0){
            increImporteFacturadoCremaciones = diffImporteFacturadoCremaciones * 100
        }else{
            increImporteFacturadoCremaciones = diffImporteFacturadoCremaciones / parseFloat(compA.particularesCremaciones[i].importeFacturadoCremaciones) * 100
        }

        if(diffImporteFacturadoCremaciones > 0){
            diffImporteFacturadoCremaciones = "+" + toFormatNumber(parseFloat(diffImporteFacturadoCremaciones).toFixed(2))
        }else{
            diffImporteFacturadoCremaciones = toFormatNumber(parseFloat(diffImporteFacturadoCremaciones).toFixed(2))
        }

        if(increImporteFacturadoCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</td>'
        diffMargenSinIvaCremaciones = parseFloat(compB.particularesCremaciones[i].margenSinIvaCremaciones) - parseFloat(compA.particularesCremaciones[i].margenSinIvaCremaciones)

        if(parseFloat(compA.particularesCremaciones[i].margenSinIvaCremaciones) == 0){
            increMargenSinIvaCremaciones = diffMargenSinIvaCremaciones * 100
        }else{
            increMargenSinIvaCremaciones = diffMargenSinIvaCremaciones / parseFloat(compA.particularesCremaciones[i].margenSinIvaCremaciones) * 100
        }

        if(diffMargenSinIvaCremaciones > 0){
            diffMargenSinIvaCremaciones = "+" + toFormatNumber(parseFloat(diffMargenSinIvaCremaciones).toFixed(2))
        }else{
            diffMargenSinIvaCremaciones = toFormatNumber(parseFloat(diffMargenSinIvaCremaciones).toFixed(2))
        }

        if(increMargenSinIvaCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }

        //NUM HOMBRES
        $content += '       <td>' + toFormatNumber(parseInt(compA.particularesNumHombres)) + '</td>'
        diffNumHombres = parseInt(compB.particularesNumHombres) - parseInt(compA.particularesNumHombres)

        if(parseInt(compA.particularesNumHombres) == 0){
            increNumHombres = diffNumHombres * 100
        }else{
            increNumHombres = diffNumHombres / parseInt(compA.particularesNumHombres) * 100
        }
        
        if(diffNumHombres > 0){
            diffNumHombres = "+" + parseInt(diffNumHombres)
        }else{
            diffNumHombres = parseInt(diffNumHombres)
        }

        if(increNumHombres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesNumHombres)) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }else if(increNumHombres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesNumHombres)) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesNumHombres)) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }


        //EDAD MEDIA HOMBRES
        $content += '       <td>' + toFormatNumber(parseInt(compA.particularesEdadMediaHombres[i])) + '</td>'
        diffEdadMediaHombres = parseInt(compB.particularesEdadMediaHombres[i]) - parseInt(compA.particularesEdadMediaHombres[i])

        if(parseInt(compA.particularesEdadMediaHombres[i]) == 0){
            increEdadMediaHombres = diffEdadMediaHombres * 100
        }else{
            increEdadMediaHombres = diffEdadMediaHombres / parseInt(compA.particularesEdadMediaHombres[i]) * 100
        }

        if(diffEdadMediaHombres > 0){
            diffEdadMediaHombres = "+" + Math.round(diffEdadMediaHombres)
        }else{
            diffEdadMediaHombres = Math.round(diffEdadMediaHombres)
        }

        if(increEdadMediaHombres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.particularesEdadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increEdadMediaHombres)) + '%</span></td>'
        }else if(increEdadMediaHombres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.particularesEdadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span style="color:green">+' + Math.round(increEdadMediaHombres) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.particularesEdadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span style="color:red">' + Math.round(increEdadMediaHombres) + '%</span></td>'
        }

        //NUM MUJERES
        $content += '       <td>' + toFormatNumber(parseInt(compA.particularesNumMujeres[i])) + '</td>'
        diffNumMujeres = parseInt(compB.particularesNumMujeres[i]) - parseInt(compA.particularesNumMujeres[i])

        if(parseInt(compA.particularesNumMujeres[i]) == 0){
            increNumMujeres = diffNumMujeres * 100
        }else{
            increNumMujeres = diffNumMujeres / parseInt(compA.particularesNumMujeres[i]) * 100
        }

        if(diffNumMujeres > 0){
            diffNumMujeres = "+" + parseInt(diffNumMujeres)
        }else{
            diffNumMujeres = parseInt(diffNumMujeres)
        }

        if(increNumMujeres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesNumMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }else if(increNumMujeres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesNumMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.particularesNumMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }

        //EDAD MEDIA MUJERES
        $content += '       <td>' + toFormatNumber(parseInt(compA.particularesEdadMediaMujeres[i])) + '</td>'
        diffEdadMediaMujeres = parseInt(compB.particularesEdadMediaMujeres[i]) - parseInt(compA.particularesEdadMediaMujeres[i])

        if(parseInt(compA.particularesEdadMediaMujeres[i]) == 0){
            increEdadMediaMujeres = diffEdadMediaMujeres * 100
        }else{
            increEdadMediaMujeres = diffEdadMediaMujeres / parseInt(compA.particularesEdadMediaMujeres[i]) * 100
        }
        if(diffEdadMediaMujeres > 0){
            diffEdadMediaMujeres = "+" + Math.round(diffEdadMediaMujeres)
        }else{
            diffEdadMediaMujeres = "+" + Math.round(diffEdadMediaMujeres)
        }
        if(increEdadMediaMujeres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.particularesEdadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }else if(increEdadMediaMujeres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.particularesEdadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.particularesEdadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }

        //BASE IMPONIBLE
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesBaseImponible[i].baseImponible).toFixed(2)) + '</td>'
        diffBaseImponible = parseFloat(compB.particularesBaseImponible[i].baseImponible) - parseFloat(compA.particularesBaseImponible[i].baseImponible)

        if(parseFloat(compA.particularesBaseImponible[i].baseImponible) == 0){
            increBaseImponible = diffBaseImponible * 100
        }else{
            increBaseImponible = diffBaseImponible / parseFloat(compA.particularesBaseImponible[i].baseImponible) * 100
        }

        if(diffBaseImponible > 0){
            diffBaseImponible = "+" +  toFormatNumber(parseFloat(diffBaseImponible).toFixed(2))
        }else{
            diffBaseImponible = toFormatNumber(parseFloat(diffBaseImponible).toFixed(2))
        }

        if(increBaseImponible == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesBaseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }else if(increBaseImponible > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesBaseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesBaseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }

        //MARGEN BRUTO
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesMargenBruto[i].margenBruto).toFixed(2)) + '</td>'
        diffMargenBruto = parseFloat(compB.particularesMargenBruto[i].margenBruto) - parseFloat(compA.particularesMargenBruto[i].margenBruto)

        if(parseFloat(compA.particularesMargenBruto[i].margenBruto) == 0){
            increMargenBruto = diffMargenBruto * 100
        }else{
            increMargenBruto = diffMargenBruto / parseFloat(compA.particularesMargenBruto[i].margenBruto) * 100
        }
        if(diffMargenBruto > 0){
            diffMargenBruto = "+" + toFormatNumber(parseFloat(diffMargenBruto).toFixed(2))
        }else{
            diffMargenBruto = toFormatNumber(parseFloat(diffMargenBruto).toFixed(2))
        }

        if(increMargenBruto == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesMargenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }else if(increMargenBruto > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesMargenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesMargenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }

        //TOTAL FACTURADO
        $content += '       <td>' + toFormatNumber(parseFloat(compA.particularesTotalFacturado[i].totalFacturado).toFixed(2)) + '</td>'
        diffTotalFacturado = parseFloat(compB.particularesTotalFacturado[i].totalFacturado) - parseFloat(compA.particularesTotalFacturado[i].totalFacturado)

        if(parseFloat(compA.particularesTotalFacturado[i].totalFacturado) == 0){
            increTotalFacturado = diffTotalFacturado * 100
        }else{
            increTotalFacturado = diffTotalFacturado / parseFloat(compA.particularesTotalFacturado[i].totalFacturado) * 100
        }
        if(diffTotalFacturado > 0){
            diffTotalFacturado = "+" + toFormatNumber(parseFloat(diffTotalFacturado).toFixed(2))
        }else{
            diffTotalFacturado = toFormatNumber(parseFloat(diffTotalFacturado).toFixed(2))
        }

        if(increTotalFacturado == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesTotalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }else if(increTotalFacturado > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesTotalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.particularesTotalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }

        //TIEMPO COBRO
        if(sumCobroA == 0){
            $content += '       <td>-</td>'
        }else{
            $content += '       <td>' + parseFloat(sumCobroA).toFixed(2) + '</td>'
        }
        diffTiempoCobro = parseFloat(parseFloat(sumCobroB) - parseFloat(sumCobroA)).toFixed(2);

        if(diffTiempoCobro == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span>(-)</span></td>'
        }else if(diffTiempoCobro > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span style="color:red">(+ ' + parseFloat(diffTiempoCobro).toFixed(2) + ')</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span style="color:green">(' + parseFloat(diffTiempoCobro).toFixed(2) + ')</span></td>'
        }

        //TIEMPO RESPUESTA
        $content += '       <td>' + (auxTimeRespuestaA == 0 ? '-' :auxTimeRespuestaA)  + '</td>'
        diffTiempoRespuesta = secondsRespuestaB - secondsRespuestaA

        diffHourRespuesta = parseInt((diffTiempoRespuesta % 86400) / 3600);
        diffMinuteRespuesta = parseInt(((diffTiempoRespuesta % 86400) % 3600) / 60);
        while(diffMinuteRespuesta >= 60){
            diffHourRespuesta += 1;
            diffMinuteRespuesta -= 60;
        }

        diffTiempoRespuestaFinal = diffHourRespuesta + "h " + diffMinuteRespuesta + "min" 
        
        if(diffTiempoRespuestaFinal == '0h 0min' || (secondsRespuestaB == 0 && secondsRespuestaA == 0)){
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span>(-)</span></td>'
        }else if(diffTiempoRespuesta > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span style="color:red">(+ ' + diffTiempoRespuestaFinal + ')</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span style="color:green">(-' + String(diffTiempoRespuestaFinal).replace("-"," ").replace("-","") + ')</span></td>'
        }
    }

    for (var i = 0; i < compA.empresasCoronas.length; i++) {
        
        totalExpedientsA += parseInt(compA.empresasExpedientes[i].expedients);
        totalExpedientsB += parseInt(compB.empresasExpedientes[i].expedients);
   
        compA.empresasCoronas[i].coronas =compA.empresasCoronas[i].coronas == null ? 0 :compA.empresasCoronas[i].coronas
        totalCoronasA += parseInt(compA.empresasCoronas[i].coronas);
        compB.empresasCoronas[i].coronas =compB.empresasCoronas[i].coronas == null ? 0 :compB.empresasCoronas[i].coronas
        totalCoronasB += parseInt(compB.empresasCoronas[i].coronas);

        compA.empresasCoronas[i].precioCosteCoronas =compA.empresasCoronas[i].precioCosteCoronas == null ? 0 :compA.empresasCoronas[i].precioCosteCoronas
        totalPrecioCosteCoronasA += parseFloat(compA.empresasCoronas[i].precioCosteCoronas);
        compB.empresasCoronas[i].precioCosteCoronas =compB.empresasCoronas[i].precioCosteCoronas == null ? 0 :compB.empresasCoronas[i].precioCosteCoronas
        totalPrecioCosteCoronasB += parseFloat(compB.empresasCoronas[i].precioCosteCoronas);

        compA.empresasCoronas[i].importeFacturadoCoronas =compA.empresasCoronas[i].importeFacturadoCoronas == null ? 0 :compA.empresasCoronas[i].importeFacturadoCoronas
        totalFacturadoCoronasA += parseFloat(compA.empresasCoronas[i].importeFacturadoCoronas);
        compB.empresasCoronas[i].importeFacturadoCoronas =compB.empresasCoronas[i].importeFacturadoCoronas == null ? 0 :compB.empresasCoronas[i].importeFacturadoCoronas
        totalFacturadoCoronasB += parseFloat(compB.empresasCoronas[i].importeFacturadoCoronas);

        compA.empresasCoronas[i].margenSinIvaCoronas =compA.empresasCoronas[i].margenSinIvaCoronas == null ? 0 :compA.empresasCoronas[i].margenSinIvaCoronas
        totalMargenCoronasA += parseFloat(compA.empresasCoronas[i].margenSinIvaCoronas);
        compB.empresasCoronas[i].margenSinIvaCoronas =compB.empresasCoronas[i].margenSinIvaCoronas == null ? 0 :compB.empresasCoronas[i].margenSinIvaCoronas
        totalMargenCoronasB += parseFloat(compB.empresasCoronas[i].margenSinIvaCoronas);

        compA.empresasRamos[i].ramos = compA.empresasRamos[i].ramos == null ? 0 : compA.empresasRamos[i].ramos
        totalRamosA += parseInt(compA.empresasRamos[i].ramos);
        compB.empresasRamos[i].ramos = compB.empresasRamos[i].ramos == null ? 0 : compB.empresasRamos[i].ramos
        totalRamosB += parseInt(compB.empresasRamos[i].ramos);

        compA.empresasRamos[i].precioCosteRamos = compA.empresasRamos[i].precioCosteRamos == null ? 0 : compA.empresasRamos[i].precioCosteRamos
        totalPrecioCosteRamosA += parseFloat(compA.empresasRamos[i].precioCosteRamos);
        compB.empresasRamos[i].precioCosteRamos = compB.empresasRamos[i].precioCosteRamos == null ? 0 : compB.empresasRamos[i].precioCosteRamos
        totalPrecioCosteRamosB += parseFloat(compB.empresasRamos[i].precioCosteRamos);

        compA.empresasRamos[i].importeFacturadoRamos = compA.empresasRamos[i].importeFacturadoRamos == null ? 0 : compA.empresasRamos[i].importeFacturadoRamos
        totalFacturadoRamosA += parseFloat(compA.empresasRamos[i].importeFacturadoRamos);
        compB.empresasRamos[i].importeFacturadoRamos = compB.empresasRamos[i].importeFacturadoRamos == null ? 0 : compB.empresasRamos[i].importeFacturadoRamos
        totalFacturadoRamosB += parseFloat(compB.empresasRamos[i].importeFacturadoRamos);

        compA.empresasRamos[i].margenSinIvaRamos = compA.empresasRamos[i].margenSinIvaRamos == null ? 0 : compA.empresasRamos[i].margenSinIvaRamos
        totalMargenRamosA += parseFloat(compA.empresasRamos[i].margenSinIvaRamos);
        compB.empresasRamos[i].margenSinIvaRamos = compB.empresasRamos[i].margenSinIvaRamos == null ? 0 : compB.empresasRamos[i].margenSinIvaRamos
        totalMargenRamosB += parseFloat(compB.empresasRamos[i].margenSinIvaRamos);

        compA.empresasCremaciones[i].cremaciones = compA.empresasCremaciones[i].cremaciones == null ? 0 : compA.empresasCremaciones[i].cremaciones
        totalCremacionesA += parseInt(compA.empresasCremaciones[i].cremaciones);
        compB.empresasCremaciones[i].cremaciones = compB.empresasCremaciones[i].cremaciones == null ? 0 : compB.empresasCremaciones[i].cremaciones
        totalCremacionesB += parseInt(compB.empresasCremaciones[i].cremaciones);

        compA.empresasCremaciones[i].precioCosteCremaciones = compA.empresasCremaciones[i].precioCosteCremaciones == null ? 0 : compA.empresasCremaciones[i].precioCosteCremaciones
        totalPrecioCosteCremacionesA += parseFloat(compA.empresasCremaciones[i].precioCosteCremaciones);
        compB.empresasCremaciones[i].precioCosteCremaciones = compB.empresasCremaciones[i].precioCosteCremaciones == null ? 0 : compB.empresasCremaciones[i].precioCosteCremaciones
        totalPrecioCosteCremacionesB += parseFloat(compB.empresasCremaciones[i].precioCosteCremaciones);

        compA.empresasCremaciones[i].importeFacturadoCremaciones = compA.empresasCremaciones[i].importeFacturadoCremaciones == null ? 0 : compA.empresasCremaciones[i].importeFacturadoCremaciones
        totalFacturadoCremacionesA += parseFloat(compA.empresasCremaciones[i].importeFacturadoCremaciones);
        compB.empresasCremaciones[i].importeFacturadoCremaciones = compB.empresasCremaciones[i].importeFacturadoCremaciones == null ? 0 : compB.empresasCremaciones[i].importeFacturadoCremaciones
        totalFacturadoCremacionesB += parseFloat(compB.empresasCremaciones[i].importeFacturadoCremaciones);

        compA.empresasCremaciones[i].margenSinIvaCremaciones = compA.empresasCremaciones[i].margenSinIvaCremaciones == null ? 0 : compA.empresasCremaciones[i].margenSinIvaCremaciones
        totalMargenCremacionesA += parseFloat(compA.empresasCremaciones[i].margenSinIvaCremaciones);
        compB.empresasCremaciones[i].margenSinIvaCremaciones = compB.empresasCremaciones[i].margenSinIvaCremaciones == null ? 0 : compB.empresasCremaciones[i].margenSinIvaCremaciones
        totalMargenCremacionesB += parseFloat(compB.empresasCremaciones[i].margenSinIvaCremaciones);

        compA.empresasNumHombres[i] = compA.empresasNumHombres[i] == null ? 0 : compA.empresasNumHombres[i]
        totalNumHombresA += parseInt(compA.empresasNumHombres[i]);
        compA.empresasEdadMediaHombres[i] = compA.empresasEdadMediaHombres[i] == null ? 0 : compA.empresasEdadMediaHombres[i]
        totalEdadMediaHombresA +=  Math.round(compA.empresasEdadMediaHombres[i]);
        if(compA.empresasEdadMediaHombres[i] != 0){
            indexHombresA++;

        }
        compB.empresasNumHombres[i] = compB.empresasNumHombres[i] == null ? 0 : compB.empresasNumHombres[i]
        totalNumHombresA += parseInt(compB.empresasNumHombres[i]);
        compB.empresasEdadMediaHombres[i] = compB.empresasEdadMediaHombres[i] == null ? 0 : compB.empresasEdadMediaHombres[i]
        totalEdadMediaHombresA +=  Math.round(compB.empresasEdadMediaHombres[i]);
        if(compB.empresasEdadMediaHombres[i] != 0){
            indexHombresB++;
        }

        compB.empresasNumMujeres[i] = compB.empresasNumMujeres[i] == null ? 0 : compB.empresasNumMujeres[i]
        totalNumMujeresA += parseInt(compB.empresasNumMujeres[i]);
        compB.empresasEdadMediaMujeres[i] = compB.empresasEdadMediaMujeres[i] == null ? 0 : compB.empresasEdadMediaMujeres[i]
        totalEdadMediaMujeresA +=  Math.round(compB.empresasEdadMediaMujeres[i]);
        if(compB.empresasEdadMediaMujeres[i] != 0){
            indexMujeresA++;
        }

        compA.empresasNumMujeres[i] = compA.empresasNumMujeres[i] == null ? 0 : compA.empresasNumMujeres[i]
        totalNumMujeresB += parseInt(compA.empresasNumMujeres[i]);
        compA.empresasEdadMediaMujeres[i] = compA.empresasEdadMediaMujeres[i] == null ? 0 : compA.empresasEdadMediaMujeres[i]
        totalEdadMediaMujeresB +=  Math.round(compA.empresasEdadMediaMujeres[i]);
        if(compA.empresasEdadMediaMujeres[i] != 0){
            indexMujeresB++;
        }

        compA.empresasBaseImponible[i].baseImponible = compA.empresasBaseImponible[i].baseImponible == null ? 0 : compA.empresasBaseImponible[i].baseImponible
        totalBaseImponibleA += parseFloat(compA.empresasBaseImponible[i].baseImponible)
        if(compA.empresasBaseImponible[i].baseImponible > 0){
            indexBaseImponibleA++;
        }
        compB.empresasBaseImponible[i].baseImponible = compB.empresasBaseImponible[i].baseImponible == null ? 0 : compB.empresasBaseImponible[i].baseImponible
        totalBaseImponibleB += parseFloat(compB.empresasBaseImponible[i].baseImponible)
        if(compB.empresasBaseImponible[i].baseImponible > 0){
            indexBaseImponibleB++;
        }

        compA.empresasMargenBruto[i].margenBruto = compA.empresasMargenBruto[i].margenBruto == null ? 0 : compA.empresasMargenBruto[i].margenBruto
        totalMargenBrutoA += parseFloat(compA.empresasMargenBruto[i].margenBruto)
        compB.empresasMargenBruto[i].margenBruto = compB.empresasMargenBruto[i].margenBruto == null ? 0 : compB.empresasMargenBruto[i].margenBruto
        totalMargenBrutoB += parseFloat(compB.empresasMargenBruto[i].margenBruto)

        compA.empresasTotalFacturado[i].totalFacturado = compA.empresasTotalFacturado[i].totalFacturado == null ? 0 : compA.empresasTotalFacturado[i].totalFacturado
        totalTotalFacturacionA += parseFloat(compA.empresasTotalFacturado[i].totalFacturado)
        compB.empresasTotalFacturado[i].totalFacturado = compB.empresasTotalFacturado[i].totalFacturado == null ? 0 : compB.empresasTotalFacturado[i].totalFacturado
        totalTotalFacturacionA += parseFloat(compB.empresasTotalFacturado[i].totalFacturado)
        
        compA.empresasTiempoCobro[i].tiempoCobro = compA.empresasTiempoCobro[i].tiempoCobro == null ? '-' : compA.empresasTiempoCobro[i].tiempoCobro
        var auxHourCobroA = 0;
        var auxMinuteCobroA = 0;
        var auxTimeCobroA = '-';
        var secondsCobroA = 0;
        var sumCobroA = 0;
        var sumCobroB = 0;
        if(compA.empresasTiempoCobro[i].tiempoCobro != '-'){
            sumCobroA = compA.empresasTiempoCobro[i].tiempoCobro;
            // auxHourCobroA = parseInt(compA.empresasTiempoCobro[i].tiempoCobro.split(":")[0])
            // auxMinuteCobroA = parseInt(compA.empresasTiempoCobro[i].tiempoCobro.split(":")[1])
            // secondsCobroA = auxHourCobroA*3600 + auxMinuteCobroA*60
            // auxHourCobroA = Math.floor((secondsCobroA % 86400) / 3600);
            // auxMinuteCobroA = Math.floor(((secondsCobroA % 86400) % 3600) / 60);

            // hourCobroA += parseInt(compA.empresasTiempoCobro[i].tiempoCobro.split(":")[0])
            // minuteCobroA += parseInt(compA.empresasTiempoCobro[i].tiempoCobro.split(":")[1])

            // if(minuteCobroA >= 60){
            //     hourCobroA += 1;
            //     minuteCobroA -= 60;
            // }

            // if(hourCobroA >= 24){
            //     dayCobroA += 1;
            //     hourCobroA -= 24;
            // }
            // indexTiempoCobroA++;
            // auxTimeCobroA = auxHourCobroA + "h " + auxMinuteCobroA + "min" 
        }

        compB.empresasTiempoCobro[i].tiempoCobro = compB.empresasTiempoCobro[i].tiempoCobro == null ? '-' : compB.empresasTiempoCobro[i].tiempoCobro
        var auxHourCobroB = 0;
        var auxMinuteCobroB = 0;
        var auxTimeCobroB = '-';
        var secondsCobroB = 0;
        if(compB.empresasTiempoCobro[i].tiempoCobro != '-'){

            sumCobroB = compB.empresasTiempoCobro[i].tiempoCobro;
            // auxHourCobroB = parseInt(compB.empresasTiempoCobro[i].tiempoCobro.split(":")[0])
            // auxMinuteCobroB = parseInt(compB.empresasTiempoCobro[i].tiempoCobro.split(":")[1])
            // secondsCobroB = auxHourCobroB*3600 + auxMinuteCobroB*60
            // auxHourCobroB = Math.floor((secondsCobroB % 86400) / 3600);
            // auxMinuteCobroB = Math.floor(((secondsCobroB % 86400) % 3600) / 60);

            // hourCobroB += parseInt(compB.empresasTiempoCobro[i].tiempoCobro.split(":")[0])
            // minuteCobroB += parseInt(compB.empresasTiempoCobro[i].tiempoCobro.split(":")[1])

            // if(minuteCobroB >= 60){
            //     hourCobroB += 1;
            //     minuteCobroB -= 60;
            // }

            // if(hourCobroB >= 24){
            //     dayCobroB += 1;
            //     hourCobroB -= 24;
            // }
            // indexTiempoCobroB++;
            // auxTimeCobroB = auxHourCobroB + "h " + auxMinuteCobroB + "min " 
        }
        
        var auxTimeRespuestaA = 0;
        var secondsRespuestaA = 0;
        var auxHourRespuesta = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(compA.empresasTiempoRespuesta[i] != 0){
            if(compA.empresasTiempoRespuesta[i].length > 0){
                $.each(compA.empresasTiempoRespuesta[i], function(index, elem){
                    var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var diff = arriveTime.getTime() - requestTime.getTime()
                    
                    //When arrive time is bigger than request time
                    if(diff < 0){ 
                        var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                        var arriveTime = new Date(arriveTimeAux)
                        var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                        var diff = arriveTime.getTime() - requestTime.getTime()
                    }

                    auxHourRespuestaAux = 0;
                    auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                    while(auxMinuteRespuestaAux >= 60){
                        auxHourRespuestaAux++;
                        auxMinuteRespuestaAux -= 60;
                    }

                    auxHourRespuesta += auxHourRespuestaAux;
                    auxMinuteRespuesta += auxMinuteRespuestaAux;
                })

                let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                let averageSeconds = seconds / compA.empresasTiempoRespuesta[i].length
                secondsRespuestaA = averageSeconds;

                auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(auxMinuteRespuesta >= 60){
                    auxHourRespuesta += 1;
                    auxMinuteRespuesta -= 60;
                }

                hourRespuestaA += Math.floor((averageSeconds % 86400) / 3600);
                minuteRespuestaA += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(minuteRespuestaA >= 60){
                    hourRespuestaA += 1;
                    minuteRespuestaA -= 60;
                }

                auxTimeRespuestaA =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                indexTiempoRespuestaA++;
            }
        }

        var auxTimeRespuestaB = 0;
        var secondsRespuestaB = 0;
        var auxHourRespuesta = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(compB.empresasTiempoRespuesta[i] != 0){
            if(compB.empresasTiempoRespuesta[i].length > 0){
                $.each(compB.empresasTiempoRespuesta[i], function(index, elem){
                    var arriveTime = new Date(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var requestTime = new Date(moment(elem.requestDate + ' ' + elem.requestTime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                    var diff = arriveTime.getTime() - requestTime.getTime()
                    
                    //When arrive time is bigger than request time
                    if(diff < 0){ 
                        var arriveTimeAux = moment(parseInt(moment(elem.arriveDate + ' ' + elem.arriveTime, 'YYYY-MM-DD HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                        var arriveTime = new Date(arriveTimeAux)
                        var requestTime = new Date(moment(elem.requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                        var diff = arriveTime.getTime() - requestTime.getTime()
                    }

                    auxHourRespuestaAux = 0;
                    auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
                    while(auxMinuteRespuestaAux >= 60){
                        auxHourRespuestaAux++;
                        auxMinuteRespuestaAux -= 60;
                    }

                    auxHourRespuesta += auxHourRespuestaAux;
                    auxMinuteRespuesta += auxMinuteRespuestaAux;
                })

                let seconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60
                let averageSeconds = seconds / compB.empresasTiempoRespuesta[i].length
                secondsRespuestaB = averageSeconds;

                auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
                auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(auxMinuteRespuesta >= 60){
                    auxHourRespuesta += 1;
                    auxMinuteRespuesta -= 60;
                }

                hourRespuestaB += Math.floor((averageSeconds % 86400) / 3600);
                minuteRespuestaB += Math.floor(((averageSeconds % 86400) % 3600) / 60);
                while(minuteRespuestaB >= 60){
                    hourRespuestaB += 1;
                    minuteRespuestaB -= 60;
                }

                auxTimeRespuestaB =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
                indexTiempoRespuestaB++;
            }
        }


        // CALCULAMOS LA DIFERENCIA DE LA COMPARACIÓN PARA CADA CAMPO Y TAMBIÉN SU INCREMENTO
        $content += '   <tr class="text-center">' +
                    '       <td style="white-space: nowrap;"><strong>Empresas</strong></td>' +
                    '       <td>' + toFormatNumber(compA.empresasExpedientes[i].expedients) + '</td>'
    
        //EXPEDIENTES
        diffExpedients = parseFloat(compB.empresasExpedientes[i].expedients) - parseFloat(compA.empresasExpedientes[i].expedients)
        if(parseFloat(compA.empresasExpedientes[i].expedients) == 0){
            increExpedients = diffExpedients * 100
        }else{
            increExpedients = diffExpedients /  parseFloat(compA.empresasExpedientes[i].expedients) * 100
        }

        if(diffExpedients > 0){
            diffExpedients = "+" + toFormatNumber(parseInt(diffExpedients))
        }else{
            diffExpedients = toFormatNumber(parseInt(diffExpedients))
        }

        if(increExpedients == 0){
            $content += '       <td id="'+ compB.empresasExpedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(parseInt(compB.empresasExpedientes[i].expedients)) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increExpedients).toFixed(2)) + '%</span></td>'
        }else if(increExpedients > 0){
            $content += '       <td id="'+ compB.empresasExpedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(parseInt(compB.empresasExpedientes[i].expedients)) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increExpedients).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td id="'+ compB.empresasExpedientes[i].clientID + '" style="white-space: nowrap;"><span style="cursor: pointer; text-decoration: underline;">' + toFormatNumber(parseInt(compB.empresasExpedientes[i].expedients)) + '</span> &nbsp&nbsp<span>(' + diffExpedients + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increExpedients).toFixed(2)) + '%</span></td>'
        }

        //CORONAS
        $content += '       <td>' + toFormatNumber(parseInt(compA.empresasCoronas[i].coronas)) + '</td>'
        diffCoronas = parseInt(compB.empresasCoronas[i].coronas) - parseInt(compA.empresasCoronas[i].coronas)

        if(parseInt(compA.empresasCoronas[i].coronas) == 0){ 
            increCoronas = diffCoronas * 100
        }else{
            increCoronas = diffCoronas / parseInt(compA.empresasCoronas[i].coronas) * 100
        }

        if(diffCoronas > 0){
            diffCoronas = "+" + toFormatNumber(parseInt(diffCoronas).toFixed(2))
        }else{
            diffCoronas = toFormatNumber(parseInt(diffCoronas).toFixed(2))
        }

        if(increCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasCoronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }else if(increCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasCoronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasCoronas[i].coronas)) + '</span> &nbsp&nbsp<span>(' + diffCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increCoronas)) + '%</span></td>'
        }

        //PRECIO DE COSTE CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCoronas[i].precioCosteCoronas).toFixed(2)) + '</td>'
        diffPrecioCosteCoronas = parseFloat(compB.empresasCoronas[i].precioCosteCoronas) - parseFloat(compA.empresasCoronas[i].precioCosteCoronas)

        if(parseFloat(compA.empresasCoronas[i].precioCosteCoronas) == 0){
            increPrecioCosteCoronas = diffPrecioCosteCoronas * 100
        }else{
            increPrecioCosteCoronas = diffPrecioCosteCoronas / parseFloat(compA.empresasCoronas[i].precioCosteCoronas) * 100
        }

        if(diffPrecioCosteCoronas > 0){
            diffPrecioCosteCoronas = "+" + toFormatNumber(parseFloat(diffPrecioCosteCoronas).toFixed(2))
        }else{
            diffPrecioCosteCoronas = toFormatNumber(parseFloat(diffPrecioCosteCoronas).toFixed(2))
        }

        if(increPrecioCosteCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].precioCosteCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCoronas+ ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteCoronas).toFixed(2)) + '%</span></td>'
        }


        //IMPORTE FACTURADO CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</td>'
        diffImporteFacturadoCoronas = parseFloat(compB.empresasCoronas[i].importeFacturadoCoronas) - parseFloat(compA.empresasCoronas[i].importeFacturadoCoronas)

        if(parseFloat(compA.empresasCoronas[i].importeFacturadoCoronas) == 0){
            increImporteFacturadoCoronas = diffImporteFacturadoCoronas * 100
        }else{
            increImporteFacturadoCoronas = diffImporteFacturadoCoronas / parseFloat(compA.empresasCoronas[i].importeFacturadoCoronas) * 100
        }
        
        if(diffImporteFacturadoCoronas > 0){
            diffImporteFacturadoCoronas = "+" + toFormatNumber(parseFloat(diffImporteFacturadoCoronas).toFixed(2)) 
        }else{
            diffImporteFacturadoCoronas = toFormatNumber(parseFloat(diffImporteFacturadoCoronas).toFixed(2)) 
        }

        if(increImporteFacturadoCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].importeFacturadoCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoCoronas).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA CORONAS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</td>'
        diffMargenSinIvaCoronas = parseFloat(compB.empresasCoronas[i].margenSinIvaCoronas) - parseFloat(compA.empresasCoronas[i].margenSinIvaCoronas)

        if(parseFloat(compA.empresasCoronas[i].margenSinIvaCoronas) == 0){
            increMargenSinIvaCoronas = diffMargenSinIvaCoronas * 100
        }else{
            increMargenSinIvaCoronas = diffMargenSinIvaCoronas / parseFloat(compA.empresasCoronas[i].margenSinIvaCoronas) * 100
        }

        if(diffMargenSinIvaCoronas > 0){
            diffMargenSinIvaCoronas = "+" + toFormatNumber(parseFloat(diffMargenSinIvaCoronas).toFixed(2))
        }else{
            diffMargenSinIvaCoronas = toFormatNumber(parseFloat(diffMargenSinIvaCoronas).toFixed(2))
        }

        if(increMargenSinIvaCoronas == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaCoronas > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCoronas[i].margenSinIvaCoronas).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCoronas + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaCoronas).toFixed(2)) + '%</span></td>'
        }

        //RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasRamos[i].ramos).toFixed(2)) + '</td>'
        diffRamos = parseFloat(compB.empresasRamos[i].ramos) - parseFloat(compA.empresasRamos[i].ramos)

        if(parseFloat(compA.empresasRamos[i].ramos) == 0){
            increRamos = diffRamos * 100
        }else{
            increRamos = diffRamos / parseFloat(compA.empresasRamos[i].ramos) * 100
        }

        if(diffRamos > 0){
            diffRamos = "+" + toFormatNumber(parseFloat(diffRamos).toFixed(2))
        }else{
            diffRamos = toFormatNumber(parseFloat(diffRamos).toFixed(2))
        }

        if(increRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }else if(increRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].ramos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increRamos.toFixed(2))) + '%</span></td>'
        }

        //PRECIO DE COSTE RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasRamos[i].precioCosteRamos).toFixed(2)) + '</td>'
        diffPrecioCosteRamos = parseFloat(compB.empresasRamos[i].precioCosteRamos) - parseFloat(compA.empresasRamos[i].precioCosteRamos)

        if(parseFloat(compA.empresasRamos[i].precioCosteRamos) == 0){
            increPrecioCosteRamos = diffPrecioCosteRamos * 100
        }else{
            increPrecioCosteRamos = diffPrecioCosteRamos / parseFloat(compA.empresasRamos[i].precioCosteRamos) * 100
        }

        if(diffPrecioCosteRamos > 0){
            diffPrecioCosteRamos = "+" + toFormatNumber(parseFloat(diffPrecioCosteRamos).toFixed(2))
        }else{
            diffPrecioCosteRamos = toFormatNumber(parseFloat(diffPrecioCosteRamos).toFixed(2))
        }

        if(increPrecioCosteRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].precioCosteRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteRamos).toFixed(2)) + '%</span></td>'
        }

        //IMPORTE FACTURADO RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasRamos[i].importeFacturadoRamos).toFixed(2)) + '</td>'
        diffImporteFacturadoRamos = parseFloat(compB.empresasRamos[i].importeFacturadoRamos) - parseFloat(compA.empresasRamos[i].importeFacturadoRamos)

        if(parseFloat(compA.empresasRamos[i].importeFacturadoRamos) == 0){
            increImporteFacturadoRamos = diffImporteFacturadoRamos * 100
        }else{
            increImporteFacturadoRamos = diffImporteFacturadoRamos / parseFloat(compA.empresasRamos[i].importeFacturadoRamos) * 100
        }

        if(diffImporteFacturadoRamos > 0){
            diffImporteFacturadoRamos = "+" + toFormatNumber(parseFloat(diffImporteFacturadoRamos).toFixed(2))
        }else{
            diffImporteFacturadoRamos = toFormatNumber(parseFloat(diffImporteFacturadoRamos).toFixed(2))
        }

        if(increImporteFacturadoRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].importeFacturadoRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoRamos).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA RAMOS
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasRamos[i].margenSinIvaRamos).toFixed(2)) + '</td>'
        diffMargenSinIvaRamos = parseFloat(compB.empresasRamos[i].margenSinIvaRamos) - parseFloat(compA.empresasRamos[i].margenSinIvaRamos)

        if(parseFloat(compA.empresasRamos[i].margenSinIvaRamos) == 0){
            increMargenSinIvaRamos = diffMargenSinIvaRamos * 100
        }else{
            increMargenSinIvaRamos = diffMargenSinIvaRamos / parseFloat(compA.empresasRamos[i].margenSinIvaRamos) * 100
        }

        if(diffMargenSinIvaRamos > 0){
            diffMargenSinIvaRamos = "+" + toFormatNumber(parseFloat(diffMargenSinIvaRamos).toFixed(2))
        }else{
            diffMargenSinIvaRamos = toFormatNumber(parseFloat(diffMargenSinIvaRamos).toFixed(2))
        }

        if(increMargenSinIvaRamos == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaRamos > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasRamos[i].margenSinIvaRamos).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaRamos + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaRamos).toFixed(2)) + '%</span></td>'
        }

        //CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCremaciones[i].cremaciones).toFixed(2)) + '</td>'
        diffCremaciones = parseFloat(compB.empresasCremaciones[i].cremaciones) - parseFloat(compA.empresasCremaciones[i].cremaciones)

        if(parseFloat(compA.empresasCremaciones[i].cremaciones) == 0){
            increCremaciones = diffCremaciones * 100
        }else{
            increCremaciones = diffCremaciones / parseFloat(compA.empresasCremaciones[i].cremaciones) * 100
        }

        if(diffCremaciones > 0){
            diffCremaciones = "+" + toFormatNumber(parseFloat(diffCremaciones).toFixed(2))
        }else{
            diffCremaciones = toFormatNumber(parseFloat(diffCremaciones).toFixed(2))
        }

        if(increCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].cremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increCremaciones).toFixed(2)) + '%</span></td>'
        }

        //PRECIO DE COSTE CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</td>'
        diffPrecioCosteCremaciones = parseFloat(compB.empresasCremaciones[i].precioCosteCremaciones) - parseFloat(compA.empresasCremaciones[i].precioCosteCremaciones)

        if(parseFloat(compA.empresasCremaciones[i].precioCosteCremaciones) == 0){
            increPrecioCosteCremaciones = diffPrecioCosteCremaciones * 100
        }else{
            increPrecioCosteCremaciones = diffPrecioCosteCremaciones / parseFloat(compA.empresasCremaciones[i].precioCosteCremaciones) * 100
        }

        if(diffPrecioCosteCremaciones > 0){
            diffPrecioCosteCremaciones = "+" + toFormatNumber(parseFloat(diffPrecioCosteCremaciones).toFixed(2))
        }else{
            diffPrecioCosteCremaciones = toFormatNumber(parseFloat(diffPrecioCosteCremaciones).toFixed(2))
        }

        if(increPrecioCosteCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increPrecioCosteCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].precioCosteCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffPrecioCosteCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increPrecioCosteCremaciones).toFixed(2)) + '%</span></td>'
        }

        //IMPORTE FACTURADO CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</td>'
        diffImporteFacturadoCremaciones = parseFloat(compB.empresasCremaciones[i].importeFacturadoCremaciones) - parseFloat(compA.empresasCremaciones[i].importeFacturadoCremaciones)

        if(parseFloat(compA.empresasCremaciones[i].importeFacturadoCremaciones) == 0){
            increImporteFacturadoCremaciones = diffImporteFacturadoCremaciones * 100
        }else{
            increImporteFacturadoCremaciones = diffImporteFacturadoCremaciones / parseFloat(compA.empresasCremaciones[i].importeFacturadoCremaciones) * 100
        }

        if(diffImporteFacturadoCremaciones > 0){
            diffImporteFacturadoCremaciones = "+" + toFormatNumber(parseFloat(diffImporteFacturadoCremaciones).toFixed(2))
        }else{
            diffImporteFacturadoCremaciones = toFormatNumber(parseFloat(diffImporteFacturadoCremaciones).toFixed(2))
        }

        if(increImporteFacturadoCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increImporteFacturadoCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].importeFacturadoCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffImporteFacturadoCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increImporteFacturadoCremaciones).toFixed(2)) + '%</span></td>'
        }

        //MARGEN SIN IVA CREMACIONES
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</td>'
        diffMargenSinIvaCremaciones = parseFloat(compB.empresasCremaciones[i].margenSinIvaCremaciones) - parseFloat(compA.empresasCremaciones[i].margenSinIvaCremaciones)

        if(parseFloat(compA.empresasCremaciones[i].margenSinIvaCremaciones) == 0){
            increMargenSinIvaCremaciones = diffMargenSinIvaCremaciones * 100
        }else{
            increMargenSinIvaCremaciones = diffMargenSinIvaCremaciones / parseFloat(compA.empresasCremaciones[i].margenSinIvaCremaciones) * 100
        }

        if(diffMargenSinIvaCremaciones > 0){
            diffMargenSinIvaCremaciones = "+" + toFormatNumber(parseFloat(diffMargenSinIvaCremaciones).toFixed(2))
        }else{
            diffMargenSinIvaCremaciones = toFormatNumber(parseFloat(diffMargenSinIvaCremaciones).toFixed(2))
        }

        if(increMargenSinIvaCremaciones == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }else if(increMargenSinIvaCremaciones > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasCremaciones[i].margenSinIvaCremaciones).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenSinIvaCremaciones + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenSinIvaCremaciones).toFixed(2)) + '%</span></td>'
        }

        //NUM HOMBRES
        $content += '       <td>' + toFormatNumber(parseInt(compA.empresasNumHombres)) + '</td>'
        diffNumHombres = parseInt(compB.empresasNumHombres) - parseInt(compA.empresasNumHombres)

        if(parseInt(compA.empresasNumHombres) == 0){
            increNumHombres = diffNumHombres * 100
        }else{
            increNumHombres = diffNumHombres / parseInt(compA.empresasNumHombres) * 100
        }
        
        if(diffNumHombres > 0){
            diffNumHombres = "+" + parseInt(diffNumHombres)
        }else{
            diffNumHombres = parseInt(diffNumHombres)
        }

        if(increNumHombres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasNumHombres)) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }else if(increNumHombres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasNumHombres)) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasNumHombres)) + '</span> &nbsp&nbsp<span>(' + diffNumHombres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increNumHombres)) + '%</span></td>'
        }


        //EDAD MEDIA HOMBRES
        $content += '       <td>' + toFormatNumber(parseInt(compA.empresasEdadMediaHombres[i])) + '</td>'
        diffEdadMediaHombres = parseInt(compB.empresasEdadMediaHombres[i]) - parseInt(compA.empresasEdadMediaHombres[i])

        if(parseInt(compA.empresasEdadMediaHombres[i]) == 0){
            increEdadMediaHombres = diffEdadMediaHombres * 100
        }else{
            increEdadMediaHombres = diffEdadMediaHombres / parseInt(compA.empresasEdadMediaHombres[i]) * 100
        }

        if(diffEdadMediaHombres > 0){
            diffEdadMediaHombres = "+" + Math.round(diffEdadMediaHombres)
        }else{
            diffEdadMediaHombres = Math.round(diffEdadMediaHombres)
        }

        if(increEdadMediaHombres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.empresasEdadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increEdadMediaHombres)) + '%</span></td>'
        }else if(increEdadMediaHombres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.empresasEdadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span style="color:green">+' + Math.round(increEdadMediaHombres) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.empresasEdadMediaHombres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaHombres + ')</span>&nbsp&nbsp<span style="color:red">' + Math.round(increEdadMediaHombres) + '%</span></td>'
        }

        //NUM MUJERES
        $content += '       <td>' + toFormatNumber(parseInt(compA.empresasNumMujeres[i])) + '</td>'
        diffNumMujeres = parseInt(compB.empresasNumMujeres[i]) - parseInt(compA.empresasNumMujeres[i])

        if(parseInt(compA.empresasNumMujeres[i]) == 0){
            increNumMujeres = diffNumMujeres * 100
        }else{
            increNumMujeres = diffNumMujeres / parseInt(compA.empresasNumMujeres[i]) * 100
        }

        if(diffNumMujeres > 0){
            diffNumMujeres = "+" + parseInt(diffNumMujeres)
        }else{
            diffNumMujeres = parseInt(diffNumMujeres)
        }

        if(increNumMujeres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasNumMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }else if(increNumMujeres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasNumMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseInt(compB.empresasNumMujeres[i])) + '</span> &nbsp&nbsp<span>(' + diffNumMujeres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increNumMujeres)) + '%</span></td>'
        }

        //EDAD MEDIA MUJERES
        $content += '       <td>' + toFormatNumber(parseInt(compA.empresasEdadMediaMujeres[i])) + '</td>'
        diffEdadMediaMujeres = parseInt(compB.empresasEdadMediaMujeres[i]) - parseInt(compA.empresasEdadMediaMujeres[i])

        if(parseInt(compA.empresasEdadMediaMujeres[i]) == 0){
            increEdadMediaMujeres = diffEdadMediaMujeres * 100
        }else{
            increEdadMediaMujeres = diffEdadMediaMujeres / parseInt(compA.empresasEdadMediaMujeres[i]) * 100
        }
        if(diffEdadMediaMujeres > 0){
            diffEdadMediaMujeres = "+" + Math.round(diffEdadMediaMujeres)
        }else{
            diffEdadMediaMujeres = "+" + Math.round(diffEdadMediaMujeres)
        }
        if(increEdadMediaMujeres == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.empresasEdadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }else if(increEdadMediaMujeres > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.empresasEdadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + Math.round(compB.empresasEdadMediaMujeres[i]) + '</span> &nbsp&nbsp<span>(' + diffEdadMediaMujeres + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseInt(increEdadMediaMujeres)) + '%</span></td>'
        }

        //BASE IMPONIBLE
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasBaseImponible[i].baseImponible).toFixed(2)) + '</td>'
        diffBaseImponible = parseFloat(compB.empresasBaseImponible[i].baseImponible) - parseFloat(compA.empresasBaseImponible[i].baseImponible)

        if(parseFloat(compA.empresasBaseImponible[i].baseImponible) == 0){
            increBaseImponible = diffBaseImponible * 100
        }else{
            increBaseImponible = diffBaseImponible / parseFloat(compA.empresasBaseImponible[i].baseImponible) * 100
        }

        if(diffBaseImponible > 0){
            diffBaseImponible = "+" +  toFormatNumber(parseFloat(diffBaseImponible).toFixed(2))
        }else{
            diffBaseImponible = toFormatNumber(parseFloat(diffBaseImponible).toFixed(2))
        }

        if(increBaseImponible == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasBaseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }else if(increBaseImponible > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasBaseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasBaseImponible[i].baseImponible).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffBaseImponible + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increBaseImponible).toFixed(2)) + '%</span></td>'
        }

        //MARGEN BRUTO
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasMargenBruto[i].margenBruto).toFixed(2)) + '</td>'
        diffMargenBruto = parseFloat(compB.empresasMargenBruto[i].margenBruto) - parseFloat(compA.empresasMargenBruto[i].margenBruto)

        if(parseFloat(compA.empresasMargenBruto[i].margenBruto) == 0){
            increMargenBruto = diffMargenBruto * 100
        }else{
            increMargenBruto = diffMargenBruto / parseFloat(compA.empresasMargenBruto[i].margenBruto) * 100
        }
        if(diffMargenBruto > 0){
            diffMargenBruto = "+" + toFormatNumber(parseFloat(diffMargenBruto).toFixed(2))
        }else{
            diffMargenBruto = toFormatNumber(parseFloat(diffMargenBruto).toFixed(2))
        }

        if(increMargenBruto == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasMargenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }else if(increMargenBruto > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasMargenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasMargenBruto[i].margenBruto).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffMargenBruto + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increMargenBruto).toFixed(2)) + '%</span></td>'
        }

        //TOTAL FACTURADO
        $content += '       <td>' + toFormatNumber(parseFloat(compA.empresasTotalFacturado[i].totalFacturado).toFixed(2)) + '</td>'
        diffTotalFacturado = parseFloat(compB.empresasTotalFacturado[i].totalFacturado) - parseFloat(compA.empresasTotalFacturado[i].totalFacturado)

        if(parseFloat(compA.empresasTotalFacturado[i].totalFacturado) == 0){
            increTotalFacturado = diffTotalFacturado * 100
        }else{
            increTotalFacturado = diffTotalFacturado / parseFloat(compA.empresasTotalFacturado[i].totalFacturado) * 100
        }
        if(diffTotalFacturado > 0){
            diffTotalFacturado = "+" + toFormatNumber(parseFloat(diffTotalFacturado).toFixed(2))
        }else{
            diffTotalFacturado = toFormatNumber(parseFloat(diffTotalFacturado).toFixed(2))
        }

        if(increTotalFacturado == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasTotalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span>' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }else if(increTotalFacturado > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasTotalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span style="color:green">+' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + toFormatNumber(parseFloat(compB.empresasTotalFacturado[i].totalFacturado).toFixed(2)) + '</span> &nbsp&nbsp<span>(' + diffTotalFacturado + ')</span>&nbsp&nbsp<span style="color:red">' + toFormatNumber(parseFloat(increTotalFacturado).toFixed(2)) + '%</span></td>'
        }

        //TIEMPO COBRO
        if(sumCobroA == 0){
            $content += '       <td>-</td>'
        }else{
            $content += '       <td>' + parseFloat(sumCobroA).toFixed(2) + '</td>'
        }
        diffTiempoCobro = parseFloat(parseFloat(sumCobroB) - parseFloat(sumCobroA)).toFixed(2);

        if(diffTiempoCobro == 0){
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span>(-)</span></td>'
        }else if(diffTiempoCobro > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span style="color:red">(+ ' + parseFloat(diffTiempoCobro).toFixed(2) + ')</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + parseFloat(sumCobroB).toFixed(2) + '</span> &nbsp&nbsp<span style="color:green">(' + parseFloat(diffTiempoCobro).toFixed(2) + ')</span></td>'
        }
    
        //TIEMPO RESPUESTA
        $content += '       <td>' + (auxTimeRespuestaA == 0 ? '-' :auxTimeRespuestaA)  + '</td>'
        diffTiempoRespuesta = secondsRespuestaB - secondsRespuestaA

        diffHourRespuesta = parseInt((diffTiempoRespuesta % 86400) / 3600);
        diffMinuteRespuesta = parseInt(((diffTiempoRespuesta % 86400) % 3600) / 60);
        while(diffMinuteRespuesta >= 60){
            diffHourRespuesta += 1;
            diffMinuteRespuesta -= 60;
        }

        diffTiempoRespuestaFinal = diffHourRespuesta + "h " + diffMinuteRespuesta + "min" 
        
        if(diffTiempoRespuestaFinal == '0h 0min' || (secondsRespuestaB == 0 && secondsRespuestaA == 0)){
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span>(-)</span></td>'
        }else if(diffTiempoRespuesta > 0){
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span style="color:red">(+ ' + diffTiempoRespuestaFinal + ')</span></td>'
        }else{
            $content += '       <td style="white-space: nowrap;"><span>' + (auxTimeRespuestaB == 0 ? '-' :auxTimeRespuestaB) + '</span> &nbsp&nbsp<span style="color:green">(-' + String(diffTiempoRespuestaFinal).replace("-"," ").replace("-","") + ')</span></td>'
        }
    }

    $('#generalsBody').append($content);
    detectClientID();
}

/**
 * Obtiene las estadísticas generales para cada tipo de cliente
 * 
 * @param {array} data Array de datos 
 * @param {int} mode Es diferente de NULL cuando se trata de Particulares u Empresas 
 */
function getGeneralStatisticsClient(data, mode=null){

    var tableContent = '';
    var tableCols = ''
    $("#expedientsTitle").empty();
    $("#clientName").empty();
    if(mode == 1){
        $("#expedientsTitle").append('Estadísticas de <strong>Particulares</strong>');
        $("#clientName").append('<span>RESUMEN DE PARTICULARES</span>');
    }else if(mode == 3){
        $("#expedientsTitle").append('Estadísticas de <strong>Empresas</strong>');
        $("#clientName").append('<span>RESUMEN DE EMPRESAS</span>');
    }else{
        $("#expedientsTitle").append('Estadísticas de <strong>' + data.baseImponible[0].name + '</strong>');
        $("#clientName").append('<span>RESUMEN DE ' + data.baseImponible[0].name.toUpperCase() +'</span>');
    }

    $("#generalsExpedientsBody").empty();

    tableCols += '<tr>'
    if(mode == 1 || mode == 3){
       tableCols += ' <td class="toBold text-center">CLIENTE</td>'
    }

    tableCols +=  ' <td class="toBold text-center">NÚM. EXPEDIENTE</td>'
                + ' <td class="toBold text-center">BASE IMPONIBLE</td>'
                + ' <td class="toBold text-center">SUPLIDOS</td>'
                + ' <td class="toBold text-center">FACTURACIÓN</td>'
                + ' <td class="toBold text-center">TOTAL NETO</td>'
                // + ' <td class="toBold text-center">NÚM. FACTURA</td>'
                // + ' <td class="toBold text-center">ESTADO FACTURA</td>'
                + ' <td class="toBold text-center">MARGEN BRUTO</td>'
                + ' <td class="toBold text-center">IMPORTE COBRADO</td>'
                + ' <td class="toBold text-center">IMPORTE PENDIENTE</td>'
                + ' <td class="toBold text-center">TIEMPO COBRO</td>'
                + ' <td class="toBold text-center">TIEMPO RESPUESTA</td>'
            + ' </tr> '

    $("#generalsExpedientsBody").append(tableCols)

    tableCols = '';                          
    var totalBaseImponible = 0;
    var totalSuplidos = 0;
    var totalMargenBruto = 0;
    var totalTotalFacturacion = 0;
    var totalFacturadoExpediente = 0;
    var indexTiempoCobro = 0;
    var indexTiempoRespuesta = 0;
    var totalPagado = 0;
    var totalPendiente = 0;

    var indexTiempoCobro = 0;
    var sumCobro = 0;
 
    var dayRespuesta = 0;
    var hourRespuesta = 0;
    var minuteRespuesta = 0;
    var indexTiempoRespuesta = 0;

    for (var i = 0; i < data.baseImponible.length; i++) {

        data.baseImponible[i].baseImponible = data.baseImponible[i].baseImponible == null ? 0 : data.baseImponible[i].baseImponible
        totalBaseImponible += parseFloat(data.baseImponible[i].baseImponible)

        data.suplidos[i].suplidos = data.suplidos[i].suplidos == null ? 0 : data.suplidos[i].suplidos
        totalSuplidos += parseFloat(data.suplidos[i].suplidos)

        data.margenBruto[i].margenBruto = data.margenBruto[i].margenBruto == null ? 0 : data.margenBruto[i].margenBruto
        totalMargenBruto += parseFloat(data.margenBruto[i].margenBruto)

        var facturacion = parseFloat(data.baseImponible[i].baseImponible) + parseFloat(data.suplidos[i].suplidos);
        totalFacturadoExpediente += facturacion;

        data.totalFacturacion[i].total = data.totalFacturacion[i].total == null ? 0 : parseFloat(data.totalFacturacion[i].total) + parseFloat(data.suplidos[i].suplidos)
        totalTotalFacturacion += parseFloat(data.totalFacturacion[i].total)

        data.factura[i].estado = data.factura[i].estado == null ? 0 : data.factura[i].estado
   
        data.factura[i].pagado = data.factura[i].pagado == null ? '-' : data.factura[i].pagado
        if(data.factura[i].pagado != undefined){
            totalPagado += parseFloat(data.factura[i].pagado)
        }
       
        data.factura[i].pediente = data.factura[i].pediente == null ? '-' : data.factura[i].pediente
        if(data.factura[i].pediente != undefined){
            totalPendiente += parseFloat(data.factura[i].pendiente)
        }

        data.tiempoCobro[i].tiempoCobro = data.tiempoCobro[i].tiempoCobro == null ? '-' : data.tiempoCobro[i].tiempoCobro
        data.tiempoRespuesta[i].tiempoRespuesta = data.tiempoRespuesta[i].tiempoRespuesta == null ? '-' : data.tiempoRespuesta[i].tiempoRespuesta

        var auxTimeCobro = '-';
        if(data.tiempoCobro[i].tiempoCobro != '-'){
            auxTimeCobro = parseInt(data.tiempoCobro[i].tiempoCobro).toFixed(2) + ' días'
            sumCobro += parseFloat(data.tiempoCobro[i].tiempoCobro)

            indexTiempoCobro++;
        }

        var auxTimeRespuesta = 0;
        var auxHourRespuesta = 0;
        var auxMinuteRespuesta = 0;
        var auxHourRespuestaAux = 0;
        var auxMinuteRespuestaAux = 0;
        if(data.tiempoRespuesta[i] != 0){
            var arriveTime = new Date(moment(data.tiempoRespuesta[i].arriveTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
            var requestTime = new Date(moment(data.tiempoRespuesta[i].requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
            var diff = arriveTime.getTime() - requestTime.getTime()
            
            //When arrive time is bigger than request time
            if(diff < 0){ 
                var arriveTimeAux = moment(parseInt(moment(data.tiempoRespuesta[i].arriveTime, 'HH:mm:ss').format('X')) + 24 * 3600, 'X').format('MM/DD/YYYY HH:mm:ss');
                var arriveTime = new Date(arriveTimeAux)
                var requestTime = new Date(moment(data.tiempoRespuesta[i].requestTime, 'HH:mm:ss').format('MM/DD/YYYY HH:mm:ss'))
                var diff = arriveTime.getTime() - requestTime.getTime()
            }

            auxHourRespuestaAux = 0;
            auxMinuteRespuestaAux = parseInt(diff / (1000 * 60))
            while(auxMinuteRespuestaAux >= 60){
                auxHourRespuestaAux++;
                auxMinuteRespuestaAux -= 60;
            }

            auxHourRespuesta += auxHourRespuestaAux;
            auxMinuteRespuesta += auxMinuteRespuestaAux;

            let averageSeconds = auxHourRespuesta*3600 + auxMinuteRespuesta*60

            auxHourRespuesta = Math.floor((averageSeconds % 86400) / 3600);
            auxMinuteRespuesta = Math.floor(((averageSeconds % 86400) % 3600) / 60);
            while(auxMinuteRespuesta >= 60){
                auxHourRespuesta += 1;
                auxMinuteRespuesta -= 60;
            }

            hourRespuesta += Math.floor((averageSeconds % 86400) / 3600);
            minuteRespuesta += Math.floor(((averageSeconds % 86400) % 3600) / 60);
            while(minuteRespuesta >= 60){
                hourRespuesta += 1;
                minuteRespuesta -= 60;
            }

            auxTimeRespuesta =  auxHourRespuesta + "h " + auxMinuteRespuesta + "min"
            indexTiempoRespuesta++;
        }

        tableContent += '   <tr class="text-center">' 
        if(mode == 1 || mode == 3){
            if(data.baseImponible[i].name == null){
                tableContent += '   <td><i>SIN CLIENTE</i></td>'
            }else if(mode == 1){
                tableContent += '   <td><strong>' + data.baseImponible[i].name + ' ' + data.baseImponible[i].surname +'</strong></td>'
            }else{
                tableContent += '   <td><strong>' + data.baseImponible[i].name + '</strong></td>'
            }
        }
    
        tableContent += '       <td><strong>' + data.baseImponible[i].number + '</strong></td>'+
                        '       <td>' + toFormatNumber(parseFloat(data.baseImponible[i].baseImponible).toFixed(2)) + ' €</td>' +
                        '       <td>' + toFormatNumber(parseFloat(data.suplidos[i].suplidos).toFixed(2)) + ' €</td>' +
                        '       <td>' + toFormatNumber(parseFloat(facturacion).toFixed(2)) + ' €</td>' +
                        '       <td>' + toFormatNumber(parseFloat(data.totalFacturacion[i].total).toFixed(2)) + ' €</td>';
        //  if(data.factura[i].num != 'undefined' && data.factura[i].num != null){
        //      tableContent +=               '       <td>' + data.factura[i].num + '</td>' 
        //  }else{
        //     tableContent +=               '       <td> - </td>' 
        //  } 
         
        //  if(data.factura[i] != 0){

        //     if(data.factura[i].estado == 0){
        //         tableContent += '       <td style="color:red">PENDIENTE</td>'
        //     }else{
        //         tableContent += '      <td style="color:red">PAGADO</td>'
        //     }
        // }else{
        //     tableContent += '       <td><i> - </i></td>'
        // }

       if(data.factura[i] != 0){
           tableContent += '       <td>' + toFormatNumber(parseFloat(data.margenBruto[i].margenBruto).toFixed(2)) + ' €</td>' +
                           '       <td>' + toFormatNumber(parseFloat(data.factura[i].pagado).toFixed(2)) + ' €</td>' +
                           '       <td>' + toFormatNumber(parseFloat(data.factura[i].pendiente).toFixed(2)) + ' €</td>' +
                           '       <td>' + auxTimeCobro + '</td>' +
                           '       <td>' + (auxTimeRespuesta == 0 ? '-' : auxTimeRespuesta) + '</td>' +
                           '   </tr>'
       }else{
        tableContent += '       <td>' + toFormatNumber(parseFloat(data.margenBruto[i].margenBruto).toFixed(2)) + ' €</td>' +
                        '       <td> - </td>' +
                        '       <td> - </td>' +
                        '       <td>' + auxTimeCobro + '</td>' +
                        '       <td>' + (auxTimeRespuesta == 0 ? '-' : auxTimeRespuesta) + '</td>' +
                        '   </tr>'
       }   
        $("#generalsExpedientsBody").append(tableContent);
        tableContent = ''
    }

    //Tiempo de Cobro
    var totalMediaTiempoCobro = "-";
    if(indexTiempoCobro > 0){
        totalMediaTiempoCobro = (sumCobro/indexTiempoCobro).toFixed(2) + ' días'
    }else{
        totalMediaTiempoCobro = '-';
    }

    //Tiempo de Respuesta
    var totalMediaTiempoRespuesta = "-";
    if(minuteRespuesta != 0 || hourRespuesta != 0){
        secondsTiempoRespuesta = minuteRespuesta*60 + hourRespuesta*3600
        secondsTiempoRespuesta = secondsTiempoRespuesta/indexTiempoRespuesta

        var numhoursTiempoRespuesta = Math.floor((secondsTiempoRespuesta % 86400) / 3600);
        var numminutesTiempoRespuesta = Math.floor(((secondsTiempoRespuesta % 86400) % 3600) / 60);
    
        totalMediaTiempoRespuesta = numhoursTiempoRespuesta + "h " + numminutesTiempoRespuesta + "min ";
    }

    tableContent += '   <tr class="text-center">'
    tableContent += '    <td><strong>TOTAL</strong></td>'
    if(mode == 1 || mode == 3){
        tableContent += '    <td>-</td>'
    }
    tableContent +=     
        '       <td>' + toFormatNumber(parseFloat(totalBaseImponible).toFixed(2)) + ' €</td>' +
        '       <td>' + toFormatNumber(parseFloat(totalSuplidos).toFixed(2))  + ' €</td>' +
        '       <td>' + toFormatNumber(parseFloat(totalFacturadoExpediente).toFixed(2))  + ' €</td>' +
        '       <td>' + toFormatNumber(parseFloat(totalTotalFacturacion).toFixed(2)) + ' €</td>' +
        // '       <td> - </td>' +
        // '       <td> - </td>' +
        '       <td>' + toFormatNumber(parseFloat(totalMargenBruto).toFixed(2))  + ' €</td>' +
        '       <td>' + toFormatNumber(parseFloat(totalPagado).toFixed(2)) + ' €</td>' +
        '       <td>' + toFormatNumber(parseFloat(totalPendiente).toFixed(2)) + ' €</td>' +
        '       <td>' + totalMediaTiempoCobro + '</td>' +
        '       <td>' + totalMediaTiempoRespuesta + '</td>' +
        '   </tr>'
    $("#generalsExpedientsBody").append(tableContent);
}

function detectClientID(){

    $('.expedients').click(function(){
        var clientID = $(this).attr("id")
        var from;
        var to;
        var products;
        var mortuaries;

        if(parseFloat($('#generalsBody td#'+clientID).html()) > 0){

            if($('#yearGeneral').val() != null && $('#yearGeneral').val() != 0){
                if($('#monthGeneral').val() != null && $('#monthGeneral').val() != 0){
                    if($('#monthGeneral').val() == 0){
                        from = $('#yearGeneral').val() + "-01-01"
                        to = $('#yearGeneral').val() + "-12-31"
                    }else{
                        if($('#monthGeneral').val() < 10){
                            from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
                        }else{
                            from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
                        }
            
                        if($('#monthGeneral').val() < 10){
                            to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
                        }else{
                            to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
                        }
                        $('#trimesterGeneral').val(0)
                    }
                    
                }else if($('#trimesterGeneral').val() != null && $('#trimesterGeneral').val() != 0){
                    switch ($('#trimesterGeneral').val()) {
                        case '1':
                            from = $('#yearGeneral').val() + "-01-01"
                            to = $('#yearGeneral').val() + "-04-01"
                        break;
                        case '2':
                            from = $('#yearGeneral').val() + "-04-01"
                            to = $('#yearGeneral').val() + "-07-01"
                        break;
                        case '3':
                            from = $('#yearGeneral').val() + "-07-01"
                            to = $('#yearGeneral').val() + "-10-01"
                        break;
                        case '4':
                            from = $('#yearGeneral').val() + "-10-01"
                            var year = parseInt($('#yearGeneral').val()) + 1
                            to = year + "-01-01"
                        break;
                    }
                    $('#monthGeneral').val(0)
                    $('#fromGeneral').val(null);
                    $('#toGeneral').val(null);
                }else{
                    from = $('#yearGeneral').val() + "-01-01"
                    to = $('#yearGeneral').val() + "-12-31"
                }
            }else if($('#fromGeneral').val().length > 0){
                $('#yearGeneral').val(0);
                $('#trimesterGeneral').val(0);
                $('#monthGeneral').val(0);
    
                if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
                    var today = new Date();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
        
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    to = yyyy +  '-' + mm + '-31';
                }else{
                    to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
                }
                from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
    
            }else if($('#toGeneral').val().length > 0){
                
                $('#yearGeneral').val(0);
                $('#trimesterGeneral').val(0);
                $('#monthGeneral').val(0);
    
                if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
                    from =  moment(date, "X").format("YYYY") + '-01-01';
                }else{
                    from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
                }
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }else{
                $('#yearGeneral').val(moment(date, "X").format("YYYY"))
              
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-12-01"
            }

            if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
                products = $('#productGeneral').val();
            }else{
                products = ''
            }
    
            if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
                mortuaries = $('#mortuaryGeneral').val();
            }else{
                mortuaries = ''
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'getGeneralStatisticsClientInsurance',
                    clientID : clientID,
                    dateStart: from,
                    dateEnd: to,
                    products: products,
                    mortuaries : mortuaries
    
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    getGeneralStatisticsClient(data)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            $("#modal-general-expedients").modal("show")
        }else{
            alert("No hay expedientes para los que mostrar información")
        }
    })   

    $('.particularesExpedientes').click(function(){
        var id = $(this).attr("id")
        var from;
        var to;
        var products;
        var mortuaries;
       
        if(parseFloat($('#'+id).html()) > 0){
            if($('#yearGeneral').val() != null && $('#yearGeneral').val() != 0){
                if($('#monthGeneral').val() != null && $('#monthGeneral').val() != 0){
                    if($('#monthGeneral').val() == 0){
                        from = $('#yearGeneral').val() + "-01-01"
                        to = $('#yearGeneral').val() + "-12-31"
                    }else{
                        if($('#monthGeneral').val() < 10){
                            from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
                        }else{
                            from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
                        }
            
                        if($('#monthGeneral').val() < 10){
                            to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
                        }else{
                            to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
                        }
                        $('#trimesterGeneral').val(0)
                    }
                    
                }else if($('#trimesterGeneral').val() != null && $('#trimesterGeneral').val() != 0){
                    switch ($('#trimesterGeneral').val()) {
                        case '1':
                            from = $('#yearGeneral').val() + "-01-01"
                            to = $('#yearGeneral').val() + "-04-01"
                        break;
                        case '2':
                            from = $('#yearGeneral').val() + "-04-01"
                            to = $('#yearGeneral').val() + "-07-01"
                        break;
                        case '3':
                            from = $('#yearGeneral').val() + "-07-01"
                            to = $('#yearGeneral').val() + "-10-01"
                        break;
                        case '4':
                            from = $('#yearGeneral').val() + "-10-01"
                            var year = parseInt($('#yearGeneral').val()) + 1
                            to = year + "-01-01"
                        break;
                    }
                    $('#monthGeneral').val(0)
                    $('#fromGeneral').val(null);
                    $('#toGeneral').val(null);
                }else{
                    from = $('#yearGeneral').val() + "-01-01"
                    to = $('#yearGeneral').val() + "-12-31"
                }
            }else if($('#fromGeneral').val().length > 0){
                $('#yearGeneral').val(0);
                $('#trimesterGeneral').val(0);
                $('#monthGeneral').val(0);
    
                if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
                    var today = new Date();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
        
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    to = yyyy +  '-' + mm + '-31';
                }else{
                    to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
                }
                from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
    
            }else if($('#toGeneral').val().length > 0){
                
                $('#yearGeneral').val(0);
                $('#trimesterGeneral').val(0);
                $('#monthGeneral').val(0);
    
                if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
                    from =  moment(date, "X").format("YYYY") + '-01-01';
                }else{
                    from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
                }
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }else{
                $('#yearGeneral').val(moment(date, "X").format("YYYY"))
              
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-12-01"
            }
            
            if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
                products = $('#productGeneral').val();
            }else{
                products = ''
            }
    
            if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
                mortuaries = $('#mortuaryGeneral').val();
            }else{
                mortuaries = ''
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'getGeneralStatisticsClientType',
                    clientType: 1,
                    dateStart: from,
                    dateEnd: to,
                    products: products,
                    mortuaries : mortuaries
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    getGeneralStatisticsClient(data, 1)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            $("#modal-general-expedients").modal("show")
        }else{
            alert("No hay expedientes para los que mostrar información")
        }
    })

    $('.empresasExpedientes').click(function(){
        var id = $(this).attr("id")
        var from;
        var to;
        var products;
        var mortuaries;
       
        if(parseFloat($('#'+id).html()) > 0){
            if($('#yearGeneral').val() != null && $('#yearGeneral').val() != 0){
                if($('#monthGeneral').val() != null && $('#monthGeneral').val() != 0){
                    if($('#monthGeneral').val() == 0){
                        from = $('#yearGeneral').val() + "-01-01"
                        to = $('#yearGeneral').val() + "-12-31"
                    }else{
                        if($('#monthGeneral').val() < 10){
                            from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
                        }else{
                            from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
                        }
            
                        if($('#monthGeneral').val() < 10){
                            to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
                        }else{
                            to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
                        }
                        $('#trimesterGeneral').val(0)
                    }
                    
                }else if($('#trimesterGeneral').val() != null && $('#trimesterGeneral').val() != 0){
                    switch ($('#trimesterGeneral').val()) {
                        case '1':
                            from = $('#yearGeneral').val() + "-01-01"
                            to = $('#yearGeneral').val() + "-04-01"
                        break;
                        case '2':
                            from = $('#yearGeneral').val() + "-04-01"
                            to = $('#yearGeneral').val() + "-07-01"
                        break;
                        case '3':
                            from = $('#yearGeneral').val() + "-07-01"
                            to = $('#yearGeneral').val() + "-10-01"
                        break;
                        case '4':
                            from = $('#yearGeneral').val() + "-10-01"
                            var year = parseInt($('#yearGeneral').val()) + 1
                            to = year + "-01-01"
                        break;
                    }
                    $('#monthGeneral').val(0)
                    $('#fromGeneral').val(null);
                    $('#toGeneral').val(null);
                }else{
                    from = $('#yearGeneral').val() + "-01-01"
                    to = $('#yearGeneral').val() + "-12-31"
                }
            }else if($('#fromGeneral').val().length > 0){
                $('#yearGeneral').val(0);
                $('#trimesterGeneral').val(0);
                $('#monthGeneral').val(0);
    
                if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
                    var today = new Date();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
        
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    to = yyyy +  '-' + mm + '-31';
                }else{
                    to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
                }
                from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
    
            }else if($('#toGeneral').val().length > 0){
                
                $('#yearGeneral').val(0);
                $('#trimesterGeneral').val(0);
                $('#monthGeneral').val(0);
    
                if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
                    from =  moment(date, "X").format("YYYY") + '-01-01';
                }else{
                    from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
                }
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }else{
                $('#yearGeneral').val(moment(date, "X").format("YYYY"))
              
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-12-01"
            }
            
            if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
                products = $('#productGeneral').val();
            }else{
                products = ''
            }
    
            if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
                mortuaries = $('#mortuaryGeneral').val();
            }else{
                mortuaries = ''
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'getGeneralStatisticsClientType',
                    clientType: 3,
                    dateStart: from,
                    dateEnd: to,
                    products: products,
                    mortuaries : mortuaries
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    getGeneralStatisticsClient(data, 3)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            $("#modal-general-expedients").modal("show")
        }else{
            alert("No hay expedientes para los que mostrar información")
        }
    })

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

    months = new Array();
    months[0] = "--";
    months[1] = "Enero";
    months[2] = "Febrero";
    months[3] = "Marzo";
    months[4] = "Abril";
    months[5] = "Mayo";
    months[6] = "Junio";
    months[7] = "Julio";
    months[8] = "Agosto";
    months[9] = "Septiembre";
    months[10] = "Octubre";
    months[11] = "Noviembre";
    months[12] = "Diciembre";

    // Fechas
    $('.datepicker').datepicker({
        todayHighlight: true
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT
    $.fn.select2.defaults.set("width", "100%")

    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    $('#productGeneral').select2({
        containerCssClass: 'select2-products',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/products/getProductsExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#mortuaryGeneral').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/mortuaries/getMortuaries.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || ""
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return {
                            text: item.name,
                            id: item.mortuary_id,
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#productGeneralToCompare').select2({
        containerCssClass: 'select2-products',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/products/getProductsExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#mortuaryGeneralToCompare').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/mortuaries/getMortuaries.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || ""
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return {
                            text: item.name,
                            id: item.mortuary_id,
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    // Barra de navegación inferior
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.content').css('margin-bottom', '40px')
    changeSpaceFooter()

    fillSelect()

    var date = getFirstExpedientDate();
    var year = moment(date, "X").format("YYYY");
    var month = moment(date, "X").format("MM");
    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;
    var month = new Array();
    month[0] = "-";
    month[1] = "Enero";
    month[2] = "Febrero";
    month[3] = "Marzo";
    month[4] = "Abril";
    month[5] = "Mayo";
    month[6] = "Junio";
    month[7] = "Julio";
    month[8] = "Agosto";
    month[9] = "Septiembre";
    month[10] = "Octubre";
    month[11] = "Noviembre";
    month[12] = "Diciembre";

    $('#yearGeneral').append("<option value=0 selected>-</option>");
    $('#yearGeneralToCompare').append("<option value=0 selected>-</option>");
    for (year = year; year <= currentYear; year++){
        if(currentYear == year){
            $('#yearGeneral').append("<option value=" + year + " selected>" + year + "</option>");
            $('#yearGeneralToCompare').append("<option value=" + year + ">" + year + "</option>");
        }else{
            $('#yearGeneral').append("<option value=" + year + ">" + year + "</option>");
            $('#yearGeneralToCompare').append("<option value=" + year + ">" + year + "</option>");
        }
    }
    var i = 0;
    for (i; i <= 12; i++){
        if(i == currentMonth){
            $('#monthGeneral').append("<option value=" + i + " selected>" + month[i] + "</option>");
            $('#monthGeneralToCompare').append("<option value=" + i + ">" + month[i] + "</option>");
        }else{
            $('#monthGeneral').append("<option value=" + i + ">" + month[i] + "</option>");
            $('#monthGeneralToCompare').append("<option value=" + i + ">" + month[i] + "</option>");
        }
        
    }
    $('#trimesterGeneral').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
    $('#trimesterGeneral').append($('<option></option>').attr('value', 1).text('Trimestre 1'));
    $('#trimesterGeneral').append($('<option></option>').attr('value', 2).text('Trimestre 2'));
    $('#trimesterGeneral').append($('<option></option>').attr('value', 3).text('Trimestre 3'));
    $('#trimesterGeneral').append($('<option></option>').attr('value', 4).text('Trimestre 4'));

    $('#trimesterGeneralToCompare').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
    $('#trimesterGeneralToCompare').append($('<option></option>').attr('value', 1).text('Trimestre 1'));
    $('#trimesterGeneralToCompare').append($('<option></option>').attr('value', 2).text('Trimestre 2'));
    $('#trimesterGeneralToCompare').append($('<option></option>').attr('value', 3).text('Trimestre 3'));
    $('#trimesterGeneralToCompare').append($('<option></option>').attr('value', 4).text('Trimestre 4'));

    // DATOS - ESTADISTICAS GENERALES
    if($('#monthGeneral').val() == 0){
        from = $('#yearGeneral').val() + "-01-01"
        to = $('#yearGeneral').val() + "-12-31"
    }else{
        if($('#monthGeneral').val() < 10){
            from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
        }else{
            from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
        }

        if($('#monthGeneral').val() < 10){
            to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
        }else{
            to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
        }
    }

    getGeneralStatistics(from, to)

    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/generals/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.id
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#template').change(function(){
        var ID = $(this).val();
 
        $.ajax({
            url: uri + 'core/statistics/making/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                $.ajax({
                    url: uri + 'core/statistics/generals/templates/read.php',
                    method: 'POST',
                    data: {
                        ID : ID
                    },
                    async: false,
                    success: function(data){
                        data = $.parseJSON(data)
            
                        $('#yearGeneral').val(0)
                        $('#monthGeneral').val(0)
                        var generalData = data.generalData
                        var mortuaries = data.mortuaries
                        var products = data.products
                        var mortuariesCompare = data.mortuariesCompare
                        var productsCompare = data.productsCompare
            
                        // PLANTILLA
                        $('#templateName').val(generalData.name)
            
                        // YEAR
                        if(generalData.year != null){
                            $('#yearGeneral').val(generalData.year)
                            if(generalData.month != null){
                                $('#monthGeneral').val(generalData.month)
                            }else if(generalData.trimester != null){
                                $('#trimesterGeneral').val(generalData.trimester)
                            }
                        }
                        
                        //PERIODO
                        if(generalData.dateFrom != 0 && generalData.dateUntil != 0){
                            $('#fromGeneral').val(moment(generalData.dateFrom, 'X').format('DD/MM/YYYY'))
                            $('#toGeneral').val(moment(generalData.dateUntil, 'X').format('DD/MM/YYYY'))
                        }
            
                        // TIPOS DE CLIENTES
                        if(mortuaries != null){
                            $.each(mortuaries, function(index, elem){
                                var newOption = new Option(elem.name, elem.id, true, true)
                                $('#mortuaryGeneral').append(newOption).trigger('change')
                            })
                        }
            
                        // CLIENTES
                        if(products != null){
                            $.each(products, function(index, elem){
                                var newOption = new Option(elem.name, elem.id, true, true)
                                $('#productGeneral').append(newOption).trigger('change')
                            })
                        }

                        if(generalData.yearCompare != null || generalData.dateFromCompare != 0 && generalData.dateUntil != 0 || mortuariesCompare != null || productsCompare != null){
                            $('#compareCheck').prop('checked', true).trigger('change')
                        
                            $("#yearGeneralToCompare").attr("disabled", false);
                            $("#monthGeneralToCompare").attr("disabled", false);
                            $("#trimesterGeneralToCompare").attr("disabled", false);
                            $("#productGeneralToCompare").attr("disabled", false);
                            $("#mortuaryGeneralToCompare").attr("disabled", false);
                            $("#fromGeneralToCompare").attr("disabled", false);
                            $("#toGeneralToCompare").attr("disabled", false);
                            $("#compareTo").attr("disabled", false);
                        }
            
                        // YEAR COMPARE
                        if(generalData.yearCompare != null){
                            $('#yearGeneralToCompare').val(generalData.yearCompare)
                            if(generalData.monthCompare != null){
                                $('#monthGeneralToCompare').val(generalData.monthCompare)
                            }else if(generalData.trimesterCompare != null){
                                $('#trimesterGeneralToCompare').val(generalData.trimesterCompare)
                            }
                        }
                        
                        //PERIODO COMPARE
                        if(generalData.dateFromCompare != 0 && generalData.dateUntil != 0){
                            $('#fromGeneralToCompare').val(moment(generalData.dateFromCompare, 'X').format('DD/MM/YYYY'))
                            $('#toGeneralToCompare').val(moment(generalData.dateUntilCompare, 'X').format('DD/MM/YYYY'))
                        }
            
                        // TIPOS DE CLIENTES COMPARE
                        if(mortuariesCompare != null){
                            $.each(mortuariesCompare, function(index, elem){
                                var newOption = new Option(elem.name, elem.id, true, true)
                                $('#mortuaryGeneralToCompare').append(newOption).trigger('change')
                            })
                        }
            
                        // CLIENTES COMPARE
                        if(productsCompare != null){
                            $.each(productsCompare, function(index, elem){
                                var newOption = new Option(elem.name, elem.id, true, true)
                                $('#productGeneralToCompare').append(newOption).trigger('change')
                            })
                        }
            
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })



    $('#yearGeneral').change(function(){

        $('#trimesterGeneral').val(0);
        $('#monthGeneral').val(0);
        $('#fromGeneral').val(null);
        $('#toGeneral').val(null);


        if($('#yearGeneral').val() != 0){
            from = $('#yearGeneral').val() + "-01-01"
            to = $('#yearGeneral').val() + "-12-31"
            
            if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
                var products = $('#productGeneral').val();
            }

            if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
                var mortuaries = $('#mortuaryGeneral').val();
            }
            getGeneralStatistics(from, to, products, mortuaries)
        }
    })

    $('#monthGeneral').change(function(){

        if($('#yearGeneral').val() == 0){
            $('#yearGeneral').val(moment(date, "X").format("YYYY"))
        }

        if($('#monthGeneral').val() == 0){
            from = $('#yearGeneral').val() + "-01-01"
            to = $('#yearGeneral').val() + "-12-31"
        }else{
            if($('#monthGeneral').val() < 10){
                from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
            }else{
                from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
            }

            if($('#monthGeneral').val() < 10){
                to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
            }else{
                to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
            }
        }
        $('#trimesterGeneral').val(0);
        $('#toGeneral').val(null);
        $('#fromGeneral').val(null);

        if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
            var products = $('#productGeneral').val();
        }

        if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
            var mortuaries = $('#mortuaryGeneral').val();
        }
        getGeneralStatistics(from, to, products, mortuaries)
    })

    $('#trimesterGeneral').change(function(){

        if($('#yearGeneral').val() == 0){
            $('#yearGeneral').val(1)
        }

        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        switch ($('#trimesterGeneral').val()) {
            case '1':
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-04-01"
            break;
            case '2':
                from = $('#yearGeneral').val() + "-04-01"
                to = $('#yearGeneral').val() + "-07-01"
            break;
            case '3':
                from = $('#yearGeneral').val() + "-07-01"
                to = $('#yearGeneral').val() + "-10-01"
            break;
            case '4':
                from = $('#yearGeneral').val() + "-10-01"
                var year = parseInt($('#yearGeneral').val()) + 1
                to = year + "-01-01"
            break;
        }

        if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
            var products = $('#productGeneral').val();
        }

        if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
            var mortuaries = $('#mortuaryGeneral').val();
        }
        getGeneralStatistics(from, to, products, mortuaries)

        $('#monthGeneral').val(0);
        $('#toGeneral').val(null);
        $('#fromGeneral').val(null);
    })

    $('#productGeneral').change(function(){
        var from;
        var to;
        var products;
        var mortuaries;
       
        if($('#yearGeneral').val() != null && $('#yearGeneral').val() != 0){
            if($('#monthGeneral').val() != null && $('#monthGeneral').val() != 0){
                if($('#monthGeneral').val() == 0){
                    from = $('#yearGeneral').val() + "-01-01"
                    to = $('#yearGeneral').val() + "-12-31"
                }else{
                    if($('#monthGeneral').val() < 10){
                        from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
                    }else{
                        from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
                    }
        
                    if($('#monthGeneral').val() < 10){
                        to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
                    }else{
                        to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
                    }
                    $('#trimesterGeneral').val(0)
                }
                
            }else if($('#trimesterGeneral').val() != null && $('#trimesterGeneral').val() != 0){
                switch ($('#trimesterGeneral').val()) {
                    case '1':
                        from = $('#yearGeneral').val() + "-01-01"
                        to = $('#yearGeneral').val() + "-04-01"
                    break;
                    case '2':
                        from = $('#yearGeneral').val() + "-04-01"
                        to = $('#yearGeneral').val() + "-07-01"
                    break;
                    case '3':
                        from = $('#yearGeneral').val() + "-07-01"
                        to = $('#yearGeneral').val() + "-10-01"
                    break;
                    case '4':
                        from = $('#yearGeneral').val() + "-10-01"
                        var year = parseInt($('#yearGeneral').val()) + 1
                        to = year + "-01-01"
                    break;
                }
                $('#monthGeneral').val(0)
                $('#fromGeneral').val(null);
                $('#toGeneral').val(null);
            }else{
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-12-31"
            }
        }else if($('#fromGeneral').val().length > 0){
            $('#yearGeneral').val(0);
            $('#trimesterGeneral').val(0);
            $('#monthGeneral').val(0);

            if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
    
                if (mm < 10) {
                    mm = '0' + mm;
                }
                to = yyyy +  '-' + mm + '-31';
            }else{
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

        }else if($('#toGeneral').val().length > 0){
            
            $('#yearGeneral').val(0);
            $('#trimesterGeneral').val(0);
            $('#monthGeneral').val(0);

            if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
                from =  moment(date, "X").format("YYYY") + '-01-01';
            }else{
                from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            $('#yearGeneral').val(moment(date, "X").format("YYYY"))
          
            from = $('#yearGeneral').val() + "-01-01"
            to = $('#yearGeneral').val() + "-12-01"
        }

        if($('#productGeneral').val() != null && $('#productGeneral').val() != ""){
            products = $('#productGeneral').val();
        }

        if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ""){
            mortuaries = $('#mortuaryGeneral').val();
        }

        if(moment(from, "YYYY-MM-DD").format("X") > moment(to, "YYYY-MM-DD").format("X")){
            $("#dateGeneralError").removeClass('hide');
        }else{
            getGeneralStatistics(from, to, products, mortuaries)
        }
    })

    $('#mortuaryGeneral').change(function(){
        var from;
        var to;
        var products;
        var mortuaries;
       
        if($('#yearGeneral').val() != null && $('#yearGeneral').val() != 0){
            if($('#monthGeneral').val() != null && $('#monthGeneral').val() != 0){
                if($('#monthGeneral').val() == 0){
                    from = $('#yearGeneral').val() + "-01-01"
                    to = $('#yearGeneral').val() + "-12-31"
                }else{
                    if($('#monthGeneral').val() < 10){
                        from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
                    }else{
                        from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
                    }
        
                    if($('#monthGeneral').val() < 10){
                        to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
                    }else{
                        to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
                    }
                    $('#trimesterGeneral').val(0)
                }
                
            }else if($('#trimesterGeneral').val() != null && $('#trimesterGeneral').val() != 0){
                switch ($('#trimesterGeneral').val()) {
                    case '1':
                        from = $('#yearGeneral').val() + "-01-01"
                        to = $('#yearGeneral').val() + "-04-01"
                    break;
                    case '2':
                        from = $('#yearGeneral').val() + "-04-01"
                        to = $('#yearGeneral').val() + "-07-01"
                    break;
                    case '3':
                        from = $('#yearGeneral').val() + "-07-01"
                        to = $('#yearGeneral').val() + "-10-01"
                    break;
                    case '4':
                        from = $('#yearGeneral').val() + "-10-01"
                        var year = parseInt($('#yearGeneral').val()) + 1
                        to = year + "-01-01"
                    break;
                }
                $('#monthGeneral').val(0)
                $('#fromGeneral').val(null);
                $('#toGeneral').val(null);
            }else{
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-12-31"
            }
        }else if($('#fromGeneral').val().length > 0){
            $('#yearGeneral').val(0);
            $('#trimesterGeneral').val(0);
            $('#monthGeneral').val(0);

            if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
    
                if (mm < 10) {
                    mm = '0' + mm;
                }
                to = yyyy +  '-' + mm + '-31';
            }else{
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

        }else if($('#toGeneral').val().length > 0){
            
            $('#yearGeneral').val(0);
            $('#trimesterGeneral').val(0);
            $('#monthGeneral').val(0);

            if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
                from =  moment(date, "X").format("YYYY") + '-01-01';
            }else{
                from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            $('#yearGeneral').val(moment(date, "X").format("YYYY"))
          
            from = $('#yearGeneral').val() + "-01-01"
            to = $('#yearGeneral').val() + "-12-01"
        }

        if($('#productGeneral').val() != null && $('#productGeneral').val() != ""){
            products = $('#productGeneral').val();
        }

        if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ""){
            mortuaries = $('#mortuaryGeneral').val();
        }

        if(moment(from, "YYYY-MM-DD").format("X") > moment(to, "YYYY-MM-DD").format("X")){
            $("#dateGeneralError").removeClass('hide');
        }else{
            getGeneralStatistics(from, to, products, mortuaries)
        }
    
    })

    $('#fromGeneral').change(function(){
        var from;
        var to;

        $('#yearGeneral').val(0);
        $('#trimesterGeneral').val(0);
        $('#monthGeneral').val(0);
    
        if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
            var today = new Date();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (mm < 10) {
                mm = '0' + mm;
            } 
            to = yyyy +  '-' + mm + '-31';
        }else{
            to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }

        if($('#fromGeneral').val() != '' && $('#fromGeneral').val() != ''){
            from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

            if(moment(from, "YYYY-MM-DD").format("X") > moment(to, "YYYY-MM-DD").format("X")){
                $("#dateGeneralError").removeClass('hide');
            }else{
                if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
                    var products = $('#productGeneral').val();
                }
                if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
                    var mortuaries = $('#mortuaryGeneral').val();
                }
                getGeneralStatistics(from, to, products, mortuaries)
            }
        }
    })

    $('#toGeneral').change(function(){
        var from;
        var to;

        $('#yearGeneral').val(0);
        $('#trimesterGeneral').val(0);
        $('#monthGeneral').val(0);

        if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
            from =  moment(date, "X").format("YYYY") + '-01-01';
        }else{
            from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }

        if($('#toGeneral').val() != '' && $('#toGeneral').val() != ''){
            if(moment(from, "YYYY-MM-DD").format("X") > moment($("#toGeneral").val(), "DD/MM/YYYY").format("X")){
                $("#dateGeneralError").removeClass('hide');
            }else{
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

                if($('#productGeneral').val() != null && $('#productGeneral').val() != ''){
                    var products = $('#productGeneral').val();
                }
        
                if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ''){
                    var mortuaries = $('#mortuaryGeneral').val();
                }
                getGeneralStatistics(from, to, products, mortuaries)
            }
        }
    })

    $('#yearGeneralToCompare').change(function(){

        $('#trimesterGeneralToCompare').val(0);
        $('#monthGeneralToCompare').val(0);
        $('#fromGeneralToCompare').val(null);
        $('#toGeneralToCompare').val(null);


        if($('#yearGeneralToCompare').val() != 0){
            from = $('#yearGeneralToCompare').val() + "-01-01"
            to = $('#yearGeneralToCompare').val() + "-12-31"
            
            if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ''){
                var products = $('#productGeneralToCompare').val();
            }

            if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ''){
                var mortuaries = $('#mortuaryGeneralToCompare').val();
            }
        }
    })

    $('#monthGeneralToCompare').change(function(){

        if($('#yearGeneralToCompare').val() == 0){
            $('#yearGeneralToCompare').val(moment(date, "X").format("YYYY"))
        }

        if($('#monthGeneralToCompare').val() == 0){
            from = $('#yearGeneralToCompare').val() + "-01-01"
            to = $('#yearGeneralToCompare').val() + "-12-31"
        }else{
            if($('#monthGeneralToCompare').val() < 10){
                from = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-01"
            }else{
                from = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-01"
            }

            if($('#monthGeneralToCompare').val() < 10){
                to = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-31"
            }else{
                to = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-31"
            }
        }
        $('#trimesterGeneralToCompare').val(0);
        $('#toGeneralToCompare').val(null);
        $('#fromGeneralToCompare').val(null);

        if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ''){
            var products = $('#productGeneralToCompare').val();
        }

        if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ''){
            var mortuaries = $('#mortuaryGeneralToCompare').val();
        }
    })

    $('#trimesterGeneralToCompare').change(function(){

        if($('#yearGeneralToCompare').val() == 0){
            $('#yearGeneralToCompare').val(1)
        }

        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        switch ($('#trimesterGeneralToCompare').val()) {
            case '1':
                from = $('#yearGeneralToCompare').val() + "-01-01"
                to = $('#yearGeneralToCompare').val() + "-04-01"
            break;
            case '2':
                from = $('#yearGeneralToCompare').val() + "-04-01"
                to = $('#yearGeneralToCompare').val() + "-07-01"
            break;
            case '3':
                from = $('#yearGeneralToCompare').val() + "-07-01"
                to = $('#yearGeneralToCompare').val() + "-10-01"
            break;
            case '4':
                from = $('#yearGeneralToCompare').val() + "-10-01"
                var year = parseInt($('#yearGeneralToCompare').val()) + 1
                to = year + "-01-01"
            break;
        }

        if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ''){
            var products = $('#productGeneralToCompare').val();
        }

        if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ''){
            var mortuaries = $('#mortuaryGeneralToCompare').val();
        }

        $('#monthGeneralToCompare').val(0);
        $('#toGeneralToCompare').val(null);
        $('#fromGeneralToCompare').val(null);
    })

    $('#productGeneralToCompare').change(function(){
        var from;
        var to;
        var products;
        var mortuaries;
       
        if($('#yearGeneralToCompare').val() != null && $('#yearGeneralToCompare').val() != 0){
            if($('#monthGeneralToCompare').val() != null && $('#monthGeneralToCompare').val() != 0){
                if($('#monthGeneralToCompare').val() == 0){
                    from = $('#yearGeneralToCompare').val() + "-01-01"
                    to = $('#yearGeneralToCompare').val() + "-12-31"
                }else{
                    if($('#monthGeneralToCompare').val() < 10){
                        from = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-01"
                    }else{
                        from = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-01"
                    }
        
                    if($('#monthGeneralToCompare').val() < 10){
                        to = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-31"
                    }else{
                        to = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-31"
                    }
                    $('#trimesterGeneralToCompare').val(0)
                }
                
            }else if($('#trimesterGeneralToCompare').val() != null && $('#trimesterGeneralToCompare').val() != 0){
                switch ($('#trimesterGeneralToCompare').val()) {
                    case '1':
                        from = $('#yearGeneralToCompare').val() + "-01-01"
                        to = $('#yearGeneralToCompare').val() + "-04-01"
                    break;
                    case '2':
                        from = $('#yearGeneralToCompare').val() + "-04-01"
                        to = $('#yearGeneralToCompare').val() + "-07-01"
                    break;
                    case '3':
                        from = $('#yearGeneralToCompare').val() + "-07-01"
                        to = $('#yearGeneralToCompare').val() + "-10-01"
                    break;
                    case '4':
                        from = $('#yearGeneralToCompare').val() + "-10-01"
                        var year = parseInt($('#yearGeneralToCompare').val()) + 1
                        to = year + "-01-01"
                    break;
                }
                $('#monthGeneralToCompare').val(0)
                $('#fromGeneralToCompare').val(null);
                $('#toGeneralToCompare').val(null);
            }
        }else if($('#fromGeneralToCompare').val().length > 0){
            $('#yearGeneralToCompare').val(0);
            $('#trimesterGeneralToCompare').val(0);
            $('#monthGeneralToCompare').val(0);

            if($('#toGeneralToCompare').val() == '' || $('#toGeneralToCompare').val() == null){
                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
    
                if (mm < 10) {
                    mm = '0' + mm;
                }
                to = yyyy +  '-' + mm + '-31';
            }else{
                to = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            from = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

        }else if($('#toGeneralToCompare').val().length > 0){
            
            $('#yearGeneralToCompare').val(0);
            $('#trimesterGeneralToCompare').val(0);
            $('#monthGeneralToCompare').val(0);

            if($('#fromGeneralToCompare').val() == '' && $('#fromGeneralToCompare').val() == ''){
                from =  moment(date, "X").format("YYYY") + '-01-01';
            }else{
                from = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            to = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            $('#yearGeneralToCompare').val(moment(date, "X").format("YYYY"))
          
            from = $('#yearGeneralToCompare').val() + "-01-01"
            to = $('#yearGeneralToCompare').val() + "-12-01"
        }

        if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ""){
            products = $('#productGeneralToCompare').val();
        }

        if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ""){
            mortuaries = $('#mortuaryGeneralToCompare').val();
        }
    })

    $('#mortuaryGeneralToCompare').change(function(){
        var from;
        var to;
        var products;
        var mortuaries;
       
        if($('#yearGeneralToCompare').val() != null && $('#yearGeneralToCompare').val() != 0){
            if($('#monthGeneralToCompare').val() != null && $('#monthGeneralToCompare').val() != 0){
                if($('#monthGeneralToCompare').val() == 0){
                    from = $('#yearGeneralToCompare').val() + "-01-01"
                    to = $('#yearGeneralToCompare').val() + "-12-31"
                }else{
                    if($('#monthGeneralToCompare').val() < 10){
                        from = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-01"
                    }else{
                        from = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-01"
                    }
        
                    if($('#monthGeneralToCompare').val() < 10){
                        to = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-31"
                    }else{
                        to = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-31"
                    }
                    $('#trimesterGeneralToCompare').val(0)
                }
                
            }else if($('#trimesterGeneralToCompare').val() != null && $('#trimesterGeneralToCompare').val() != 0){
                switch ($('#trimesterGeneralToCompare').val()) {
                    case '1':
                        from = $('#yearGeneralToCompare').val() + "-01-01"
                        to = $('#yearGeneralToCompare').val() + "-04-01"
                    break;
                    case '2':
                        from = $('#yearGeneralToCompare').val() + "-04-01"
                        to = $('#yearGeneralToCompare').val() + "-07-01"
                    break;
                    case '3':
                        from = $('#yearGeneralToCompare').val() + "-07-01"
                        to = $('#yearGeneralToCompare').val() + "-10-01"
                    break;
                    case '4':
                        from = $('#yearGeneralToCompare').val() + "-10-01"
                        var year = parseInt($('#yearGeneralToCompare').val()) + 1
                        to = year + "-01-01"
                    break;
                }
                $('#monthGeneralToCompare').val(0)
                $('#fromGeneralToCompare').val(null);
                $('#toGeneralToCompare').val(null);
            }
        }else if($('#fromGeneralToCompare').val().length > 0){
            $('#yearGeneralToCompare').val(0);
            $('#trimesterGeneralToCompare').val(0);
            $('#monthGeneralToCompare').val(0);

            if($('#toGeneralToCompare').val() == '' || $('#toGeneralToCompare').val() == null){
                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
    
                if (mm < 10) {
                    mm = '0' + mm;
                }
                to = yyyy +  '-' + mm + '-31';
            }else{
                to = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            from = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

        }else if($('#toGeneralToCompare').val().length > 0){
            
            $('#yearGeneralToCompare').val(0);
            $('#trimesterGeneralToCompare').val(0);
            $('#monthGeneralToCompare').val(0);

            if($('#fromGeneralToCompare').val() == '' && $('#fromGeneralToCompare').val() == ''){
                from =  moment(date, "X").format("YYYY") + '-01-01';
            }else{
                from = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            to = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            $('#yearGeneralToCompare').val(moment(date, "X").format("YYYY"))
          
            from = $('#yearGeneralToCompare').val() + "-01-01"
            to = $('#yearGeneralToCompare').val() + "-12-01"
        }

        if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ""){
            products = $('#productGeneralToCompare').val();
        }

        if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ""){
            mortuaries = $('#mortuaryGeneralToCompare').val();
        }
    })

    $('#fromGeneralToCompare').change(function(){
        var from;
        var to;

        $('#yearGeneralToCompare').val(0);
        $('#trimesterGeneralToCompare').val(0);
        $('#monthGeneralToCompare').val(0);
    
        if($('#toGeneralToCompare').val() == '' || $('#toGeneralToCompare').val() == null){
            var today = new Date();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (mm < 10) {
                mm = '0' + mm;
            } 
            to = yyyy +  '-' + mm + '-31';
        }else{
            to = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }

        if($('#fromGeneralToCompare').val() != '' && $('#fromGeneralToCompare').val() != ''){
            from = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

            if(moment(from, "YYYY-MM-DD").format("X") > moment(to, "YYYY-MM-DD").format("X")){
                $("#dateGeneralError").removeClass('hide');
            }else{
                if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ''){
                    var products = $('#productGeneralToCompare').val();
                }
                if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ''){
                    var mortuaries = $('#mortuaryGeneralToCompare').val();
                }
            }
        }
    })

    $('#toGeneralToCompare').change(function(){
        var from;
        var to;

        $('#yearGeneralToCompare').val(0);
        $('#trimesterGeneralToCompare').val(0);
        $('#monthGeneralToCompare').val(0);

        if($('#fromGeneralToCompare').val() == '' && $('#fromGeneralToCompare').val() == ''){
            from =  moment(date, "X").format("YYYY") + '-01-01';
        }else{
            from = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }

        if($('#toGeneralToCompare').val() != '' && $('#toGeneralToCompare').val() != ''){
            if(moment(from, "YYYY-MM-DD").format("X") > moment($("#toGeneralToCompare").val(), "DD/MM/YYYY").format("X")){
                $("#dateGeneralError").removeClass('hide');
            }else{
                to = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

                if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ''){
                    var products = $('#productGeneralToCompare').val();
                }
        
                if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ''){
                    var mortuaries = $('#mortuaryGeneralToCompare').val();
                }
            }
        }
    })

    $('#compareCheck').click(function(){

        if($(this).prop("checked")){
            $("#yearGeneralToCompare").attr("disabled", false);
            $("#monthGeneralToCompare").attr("disabled", false);
            $("#trimesterGeneralToCompare").attr("disabled", false);
            $("#productGeneralToCompare").attr("disabled", false);
            $("#mortuaryGeneralToCompare").attr("disabled", false);
            $("#fromGeneralToCompare").attr("disabled", false);
            $("#toGeneralToCompare").attr("disabled", false);
            $("#compareTo").attr("disabled", false);
        }else{
            $("#yearGeneralToCompare").val(0)
            $("#yearGeneralToCompare").attr("disabled", true);
            $("#monthGeneralToCompare").val(0)
            $("#monthGeneralToCompare").attr("disabled", true);
            $("#trimesterGeneralToCompare").val(0)
            $("#trimesterGeneralToCompare").attr("disabled", true);
            $("#productGeneralToCompare").val(null).trigger("change")
            $("#productGeneralToCompare").attr("disabled", true);
            $("#mortuaryGeneralToCompare").val(null).trigger("change")
            $("#mortuaryGeneralToCompare").attr("disabled", true);
            $("#fromGeneralToCompare").val(null)
            $("#fromGeneralToCompare").attr("disabled", true);
            $("#toGeneralToCompare").val(null)
            $("#toGeneralToCompare").attr("disabled", true);
            $("#compareTo").attr("disabled", true);
        }
    })

    $('#compareTo').click(function(){
        var from;
        var to;
        var products;
        var mortuaries;

        var fromCompare;
        var toCompare;
        var productsCompare;
        var mortuariesCompare;
       
        var from;
        var to;
        var products;
        var mortuaries;
       
        if($('#yearGeneral').val() != null && $('#yearGeneral').val() != 0){
            if($('#monthGeneral').val() != null && $('#monthGeneral').val() != 0){
                if($('#monthGeneral').val() == 0){
                    from = $('#yearGeneral').val() + "-01-01"
                    to = $('#yearGeneral').val() + "-12-31"
                }else{
                    if($('#monthGeneral').val() < 10){
                        from = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-01"
                    }else{
                        from = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-01"
                    }
        
                    if($('#monthGeneral').val() < 10){
                        to = $('#yearGeneral').val() + "-0" + $('#monthGeneral').val() + "-31"
                    }else{
                        to = $('#yearGeneral').val() + "-" + $('#monthGeneral').val() + "-31"
                    }
                    $('#trimesterGeneral').val(0)
                }
                
            }else if($('#trimesterGeneral').val() != null && $('#trimesterGeneral').val() != 0){
                switch ($('#trimesterGeneral').val()) {
                    case '1':
                        from = $('#yearGeneral').val() + "-01-01"
                        to = $('#yearGeneral').val() + "-04-01"
                    break;
                    case '2':
                        from = $('#yearGeneral').val() + "-04-01"
                        to = $('#yearGeneral').val() + "-07-01"
                    break;
                    case '3':
                        from = $('#yearGeneral').val() + "-07-01"
                        to = $('#yearGeneral').val() + "-10-01"
                    break;
                    case '4':
                        from = $('#yearGeneral').val() + "-10-01"
                        var year = parseInt($('#yearGeneral').val()) + 1
                        to = year + "-01-01"
                    break;
                }
                $('#monthGeneral').val(0)
                $('#fromGeneral').val(null);
                $('#toGeneral').val(null);
            }else{
                from = $('#yearGeneral').val() + "-01-01"
                to = $('#yearGeneral').val() + "-12-31"
            }
        }else if($('#fromGeneral').val().length > 0){
            $('#yearGeneral').val(0);
            $('#trimesterGeneral').val(0);
            $('#monthGeneral').val(0);

            if($('#toGeneral').val() == '' || $('#toGeneral').val() == null){
                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
    
                if (mm < 10) {
                    mm = '0' + mm;
                }
                to = yyyy +  '-' + mm + '-31';
            }else{
                to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

        }else if($('#toGeneral').val().length > 0){
            
            $('#yearGeneral').val(0);
            $('#trimesterGeneral').val(0);
            $('#monthGeneral').val(0);

            if($('#fromGeneral').val() == '' && $('#fromGeneral').val() == ''){
                from =  moment(date, "X").format("YYYY") + '-01-01';
            }else{
                from = moment($('#fromGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            to = moment($('#toGeneral').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            $('#yearGeneral').val(moment(date, "X").format("YYYY"))
            from = $('#yearGeneral').val() + "-01-01"
            to = $('#yearGeneral').val() + "-12-31"
        }

        if($('#productGeneral').val() != null && $('#productGeneral').val() != ""){
            products = $('#productGeneral').val();
        }

        if($('#mortuaryGeneral').val() != null && $('#mortuaryGeneral').val() != ""){
            mortuaries = $('#mortuaryGeneral').val();
        }

        //TO COMPARE
        if($('#yearGeneralToCompare').val() != null && $('#yearGeneralToCompare').val() != 0){
            if($('#monthGeneralToCompare').val() != null && $('#monthGeneralToCompare').val() != 0){
                if($('#monthGeneralToCompare').val() == 0){
                    fromCompare = $('#yearGeneralToCompare').val() + "-01-01"
                    toCompare = $('#yearGeneralToCompare').val() + "-12-31"
                }else{
                    if($('#monthGeneralToCompare').val() < 10){
                        fromCompare = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-01"
                    }else{
                        fromCompare = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-01"
                    }
        
                    if($('#monthGeneralToCompare').val() < 10){
                        toCompare = $('#yearGeneralToCompare').val() + "-0" + $('#monthGeneralToCompare').val() + "-31"
                    }else{
                        toCompare = $('#yearGeneralToCompare').val() + "-" + $('#monthGeneralToCompare').val() + "-31"
                    }
                    $('#trimesterGeneralToCompare').val(0)
                }
                
            }else if($('#trimesterGeneralToCompare').val() != null && $('#trimesterGeneralToCompare').val() != 0){
                switch ($('#trimesterGeneralToCompare').val()) {
                    case '1':
                        fromCompare = $('#yearGeneralToCompare').val() + "-01-01"
                        toCompare = $('#yearGeneralToCompare').val() + "-04-01"
                    break;
                    case '2':
                        fromCompare = $('#yearGeneralToCompare').val() + "-04-01"
                        toCompare = $('#yearGeneralToCompare').val() + "-07-01"
                    break;
                    case '3':
                        fromCompare = $('#yearGeneralToCompare').val() + "-07-01"
                        toCompare = $('#yearGeneralToCompare').val() + "-10-01"
                    break;
                    case '4':
                        fromCompare = $('#yearGeneralToCompare').val() + "-10-01"
                        var year = parseInt($('#yearGeneralToCompare').val()) + 1
                        toCompare = year + "-01-01"
                    break;
                }
                $('#monthGeneralToCompare').val(0)
                $('#fromGeneralToCompare').val(null);
                $('#toGeneralToCompare').val(null);
            }else{
                fromCompare = $('#yearGeneralToCompare').val() + "-01-01"
                toCompare = $('#yearGeneralToCompare').val() + "-12-31"
            }
        }else if($('#fromGeneralToCompare').val().length > 0){
            $('#yearGeneralToCompare').val(0);
            $('#trimesterGeneralToCompare').val(0);
            $('#monthGeneralToCompare').val(0);
        
            if($('#toGeneralToCompare').val().length == 0){
                var today = new Date();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
    
                if (mm < 10) {
                    mm = '0' + mm;
                }
                toCompare = yyyy +  '-' + mm + '-31';
            }else{
                toCompare = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            fromCompare = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")

        }else if($('#toGeneralToCompare').val().length > 0){
            $('#yearGeneralToCompare').val(0);
            $('#trimesterGeneralToCompare').val(0);
            $('#monthGeneralToCompare').val(0);

            if($('#fromGeneralToCompare').val().length == 0){
                fromCompare =  moment(date, "X").format("YYYY") + '-01-01';
            }else{
                fromCompare = moment($('#fromGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            }
            toCompare = moment($('#toGeneralToCompare').val(), "DD/MM/YYYY").format("YYYY-MM-DD")
        }else{
            $('#yearGeneralToCompare').val(moment(date, "X").format("YYYY"))
          
            fromCompare = $('#yearGeneralToCompare').val() + "-01-01"
            toCompare = $('#yearGeneralToCompare').val() + "-12-01"
        }

        if($('#productGeneralToCompare').val() != null && $('#productGeneralToCompare').val() != ""){
            productsCompare = $('#productGeneralToCompare').val();
        }

        if($('#mortuaryGeneralToCompare').val() != null && $('#mortuaryGeneralToCompare').val() != ""){
            mortuariesCompare = $('#mortuaryGeneralToCompare').val();
        }

        if($("#compareCheck").prop('checked') == false){
            $("#compareToError").text("Debe seleccionar algún dato para comparar")
            $("#compareToError").removeClass("hide")
        }else if($("#compareCheck").prop('checked') == true && fromCompare == null && toCompare == null && productsCompare == null && mortuariesCompare == null){
            $("#compareToError").text("Debe seleccionar algún dato para comparar")
            $("#compareToError").removeClass("hide")
        }else if(from != null && fromCompare == null){
            $("#compareToError").text("Debe seleccionar un mes o trimestre para realizar la comparación")
            $("#compareToError").removeClass("hide")
        }else if(to != null && toCompare == null){
            $("#compareToError").text("Debe seleccionar un mes o trimestre para realizar la comparación")
            $("#compareToError").removeClass("hide")
        }else if(products != null && productsCompare == null){
            $("#compareToError").text("Debe seleccionar un producto para realizar la comparación")
            $("#compareToError").removeClass("hide")
        }else if(mortuaries != null && mortuariesCompare == null){
            $("#compareToError").text("Debe seleccionar una casa mortuoria para realizar la comparación")
            $("#compareToError").removeClass("hide")
        }else{
            $("#compareToError").addClass("hide")
            var data1 = getStatisticGeneralData(from, to, products, mortuaries)
            var data2 = getStatisticGeneralData(fromCompare, toCompare, productsCompare, mortuariesCompare)
            getGeneralStatisticsToCompare(data1, data2)
        }
    })

    $('#goTotalDeceased').click(function(){
        var since = null
        if($('#sinceDate').val() == ''){
            since = $('#sinceDate').val()
        }
        var until = null
        if($('#untilDate').val() == ''){
            until = $('#untilDate').val()
        }
        getTotalDeceased(since, until)
    })

    $('#goDateTotalDeceased').click(function(){
        var validate = 0
        
        validate += $('#sinceDateTotalDeceased').val() == '' ? 1 : 0
        validate += $('#untilDateTotalDeceased').val() == '' ? 1 : 0
        
        if(validate == 0){
            $('#goDateError').addClass('hide')

            var since = moment($('#sinceDateTotalDeceased').val(), 'DD/MM/YYYY').format('X')
            var until = moment($('#untilDateTotalDeceased').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X')
            
            getTotalDeceased(since, until)

            $('#sinceDateTotalDeceased').val('')
            $('#untilDateTotalDeceased').val('')
        }else{
            $('#goDateError').removeClass('hide')
        }
    })

    $('#goDate').click(function(){
        var validate = 0
        
        validate += $('#sinceDate').val() == '' ? 1 : 0
        validate += $('#untilDate').val() == '' ? 1 : 0
        
        if(validate == 0){
            $('#goDateError').addClass('hide')

            var since = moment($('#sinceDate').val(), 'DD/MM/YYYY').format('X')
            var until = moment($('#untilDate').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X')
            
            getTotalDeceased(since, until)

            $('#sinceDate').val('')
            $('#untilDate').val('')
        }else{
            $('#goDateError').removeClass('hide')
        }
    })

    // DATOS - DEFUNCIONES POR AÑO
    $('#goDeceasedByYear').click(function(){
        getDeceasedByYear()
    })

    // DATOS - DEFUNCIONES POR AÑO (DÍA)
    $('#goDeceasedDay').click(function(){
        deceasedByYearDay()
    })

    // DATOS - DEFUNCIONES POR AÑO (NOCHE)
    $('#goDeceasedNight').click(function(){
        deceasedByYearNight()
    })

    // DATOS - DEFUNCIONES POR AÑO (NOCHE)
    $('#goDeceasedNight').click(function(){
        deceasedByYearNight()
    })

    // DATOS - DÍA VS NOCHE
    $('#goDayvsnight').click(function(){
        dayvsnight()
    })

    // DATOS - NOCHE VS DÍA
    $('#goNightvsday').click(function(){
        nightvsday()
    })

    // DATOS - CREMATORIO
    $('#goCrematorium').click(function(){

        $('#Owncrematoriums').select2({
            containerCssClass: 'select2-crematorium',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/crematoriums/dataOwns.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.crematoriumID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: false
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            templateResult: formatData,
            templateSelection: formatData
        });

        $('#Owncrematoriums').change(function(){
            getCrematoriumOwnService();
        })

        $('#Outcrematoriums').select2({
            containerCssClass: 'select2-crematorium',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/crematoriums/dataOwns.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.crematoriumID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: false
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            templateResult: formatData,
            templateSelection: formatData
        });

        $('#Outcrematoriums').change(function(){
            getCrematoriumOutService();
        })

        $('#allCrematoriums').select2({
            containerCssClass: 'select2-crematorium',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/crematoriums/data.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.crematoriumID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: false
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            templateResult: formatData,
            templateSelection: formatData
        });

        $('#allCrematoriums').change(function(){
            getCrematorium();
        })

        getCrematorium();

        getCrematoriumOwnService();

        getCrematoriumOutService();
    })

    // DATOS - CREMACIONES
    $('#goCremationsStats').click(function(){
        
        for (i=0; i < months.length; i++){
            if(i == 0){
                $('#monthCremations').append("<option value=" + i + " selected>" + months[i] + "</option>");
                $('#monthCremationsWeek').append("<option value=" + i + " selected>" + months[i] + "</option>");
            }else{
                $('#monthCremations').append("<option value=" + i + " >" + months[i] + "</option>");
                $('#monthCremationsWeek').append("<option value=" + i + " >" + months[i] + "</option>");
            }
        }

        /********* CREMATIONS DAYS OF MONTH *********/

        getCrematoriumsMonthsDays();

        $('#yearCremations').change(function(){
            getCrematoriumsMonthsDays();
        })

        $('#monthCremations').change(function(){
            getCrematoriumsMonthsDays();
        })


        /********* CREMATIONS DAYS OF WEEK *********/

        getCrematoriumsDaysWeek();

        $('#yearCremationsWeek').change(function(){
            getCrematoriumsDaysWeek();
        })

        $('#monthCremationsWeek').change(function(){
            getCrematoriumsDaysWeek();
        })
    })

    // DATOS - CREMACIONES
    $('#goJudiciales').click(function(){
        $('#monthJudiciales').empty()
        for (i=0; i < months.length; i++){
            if(i == 0){
                $('#monthJudiciales').append("<option value=" + i + " selected>" + months[i] + "</option>");
                $('#monthJudicialesWeek').append("<option value=" + i + " selected>" + months[i] + "</option>");
            }else{
                $('#monthJudiciales').append("<option value=" + i + " >" + months[i] + "</option>");
                $('#monthJudicialesWeek').append("<option value=" + i + " >" + months[i] + "</option>");
            }
        }

        /********* JUDICIALES DAYS OF MONTH *********/

        getJudicialesMonthsDays();

        $('#yearJudiciales').change(function(){
            getJudicialesMonthsDays();
        })

        $('#monthJudiciales').change(function(){
            getJudicialesMonthsDays();
        })

        $('#departureJudiciales').change(function(){
            getJudicialesMonthsDays();
        })

        $('#returnJudiciales').change(function(){
            getJudicialesMonthsDays();
        })

        /********* JUDICIALES DAYS OF WEEK *********/

        getJudicialesDaysWeek();

        $('#yearJudicialesWeek').change(function(){
            getJudicialesDaysWeek();
        })

        $('#monthJudicialesWeek').change(function(){
            getJudicialesDaysWeek();
        })

        $('#departureJudicialesWeek').change(function(){
            getJudicialesDaysWeek();
        })

        $('#returnJudicialesWeek').change(function(){
            getJudicialesDaysWeek();
        })
    })

    $('#covid').change(function(){
        var covid = $(this).val()
        totals.ajax.url(uri + "core/statistics/generals/getTotals.php?year=" + $('#yearsTotal').val() + "&covid=" + covid).load()
    })

    // TOTAL
    $('#goTotal').click(function(){
        if(totalTableLoad){
            var covid = $('#covid').val()
            totals.ajax.url(uri + "core/statistics/generals/getTotals.php?year=" + $(this).val() + "&covid=" + covid).load()
        }else{

            // DATOS - LISTADO
            totals = $('#total-table').DataTable({
                "ajax": uri + "core/statistics/generals/getTotals.php?year=" + $("#yearsTotal").val(),
                "responsive": false,
                "pageLength": 25,
                "autoWidth": true,
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                "columns": [
                    {"title": "Expediente"},
                    {"title": "Fecha solicitud"},
                    {"title": "Mes"},
                    {"title": "Año"},
                    {"title": "Día semana"},
                    {"title": "Día semana"},
                    {"title": "Hora solicitud"},
                    {"title": "Turno"},
                    {"title": "Descripción"},
                    {"title": "Hora llegada"},
                    {"title": "Hora entrada"},
                    {"title": "Nombre"},
                    {"title": "Apellidos"},
                    {"title": "DNI"},
                    {"title": "Sexo"},
                    {"title": "Nacionalidad"},
                    {"title": "Fecha nacimiento"},
                    {"title": "Lugar nacimiento"},
                    {"title": "Fecha fallecimiento"},
                    {"title": "Nombre"},
                    {"title": "Apellidos"},
                    {"title": "Nombre comercial"}
                ],
                "columnDefs": [
                    {
                        "targets": [2,3,4],
                        "orderable": false,
                        "searchable": false,
                        "visible": false
                    },
                    {
                        "targets": [1, 16, 18],
                        "render": function(data, type, row){
                            if(type === 'display' || type === 'filter'){
                                return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                            }
                            return data == null ? 0 : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                        }
                    },
                    {
                        "targets": [6, 9, 10],
                        "render": function(data, type, row){
                            if(data == null){
                                return '-'
                            }else{
                                var time = data.split(':')
                                return time[0] + ':' + time[1]
                            }
                        }
                    },
                    {
                        "targets": [5],
                        "render": function(data, type, row){
                            if(data == null){
                                return '-'
                            }else{
                                var toShow
                                switch(data.toLowerCase()){
                                    case 'monday':
                                        toShow = 'Lunes'
                                    break;
                                    case 'tuesday':
                                        toShow = 'Martes'
                                    break;
                                    case 'wednesday':
                                        toShow = 'Miércoles'
                                    break;
                                    case 'thursday':
                                        toShow = 'Jueves'
                                    break;
                                    case 'friday':
                                        toShow = 'Viernes'
                                    break;
                                    case 'saturday':
                                        toShow = 'Sábado'
                                    break;
                                    case 'sunday':
                                        toShow = 'Domingo'
                                    break;
                                    default:
                                        toShow = '-'
                                    break;
                                }
                                return toShow
                            }
                        }
                    },
                    {
                        "targets": [7],
                        "render": function(data, type, row){
                            if(row[6] == null){
                                return '-'
                            }else{
                                var time = moment(row[6], 'HH:mm').format('X')
                                return time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? 'NOCHE' : 'DÍA'
                            }
                        }
                    },
                    {
                        "targets": [8],
                        "render": function(data, type, row){
                            var dayOfWeek = null
                            if(row[5] != null){
                                switch(row[5].toLowerCase()){
                                    case 'monday':
                                        dayOfWeek = 'Lunes'
                                    break;
                                    case 'tuesday':
                                        dayOfWeek = 'Martes'
                                    break;
                                    case 'wednesday':
                                        dayOfWeek = 'Miércoles'
                                    break;
                                    case 'thursday':
                                        dayOfWeek = 'Jueves'
                                    break;
                                    case 'friday':
                                        dayOfWeek = 'Viernes'
                                    break;
                                    case 'saturday':
                                        dayOfWeek = 'Sábado'
                                    break;
                                    case 'sunday':
                                        dayOfWeek = 'Domingo'
                                    break;
                                    default:
                                        dayOfWeek = '-'
                                    break;
                                }
                            }
                            var turn = null
                            if(row[6] != null){
                                var time = moment(row[6], 'HH:mm').format('X')
                                turn = time < moment('8:00', 'HH:mm').format('X') || time > moment('21:59', 'HH:mm').format('X') ? 'NOCHE' : 'DÍA'
                            }
        
                            var toShow = ''
                            if(dayOfWeek == null && turn == null){
                                toShow = '-'
                            }else if(dayOfWeek != null && turn == null){
                                toShow = dayOfWeek + ' -'
                            }else if(dayOfWeek == null && turn != null){
                                toShow = '- ' + turn
                            }else{
                                toShow = dayOfWeek + ' ' + turn
                            }
                            return toShow
                        }
                    },
                ],
                "dom": 'rt<"bottom bottom-2"Bp><"clear">',
                "buttons": [{
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 6, 9, 10, 11, 12, 13, 19],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'Estadísticas generales - Total',
                    title: 'Estadísticas generales - Total',
                    text: 'Excel <i class="fa fa-file-excel-o"></i>',
                    className: 'c-lile export-button'
                },
                {
                    extend: 'pdfHtml5',
                    orientation: 'portrait',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 6, 9, 10, 11, 12, 13, 19],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'Estadísticas generales - Total',
                    title: 'Estadísticas generales - Total',
                    customize: function(doc){
                        // Limpia la plantilla por defecto
                        doc.content.splice(0, 1)
        
                        // Configuración
                        doc.pageMargins = [30, 60, 30, 50]
                        doc.defaultStyle.fontSize = 10
        
                        // Header
                        doc['header'] = (function(){
                            return {
                                columns: [{
                                    alignment: 'left',
                                    text: 'Listado de estadísticas generales - total',
                                    bold: true,
                                    fontSize: 12
                                },
                                {
                                    alignment: 'right',
                                    text: moment().format('DD/MM/YYYY HH:mm'),
                                    fontSize: 10
                                }],
                                margin: 30
                            }
                        })
        
                        // Footer
                        doc['footer'] = (function(page, pages){
                            return {
                                columns: [{
                                    alignment: 'center',
                                    text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                    fontSize: 10
                                }],
                                margin: 20
                            }
                        })
                    },
                    text: 'PDF <i class="fa fa-file-pdf-o"></i>',
                    className: 'c-lile export-button'
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 6, 9, 10, 11, 12, 13, 19],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize: function(win){
                        $(win.document.body).find('h1').css('display','none')
                    },
                    text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                    className: 'c-lile export-button'
                }],
            })
            
            totalTableLoad = true
        }
    })

    // DATOS - BÚSQUEDA
    $('#input-search-total').on('keyup', function(){
        totals.search(this.value).draw()
    })

    // AÑOS
    $('#yearsTotal').change(function(){
        if(yearsTotalFlag){
            var covid = $('#covid').val()
            totals.ajax.url(uri + "core/statistics/generals/getTotals.php?year=" + $(this).val() + "&covid=" + covid).load()
        }
    })

    // RESÚMENES
    $('#goSummary').click(function(){
        if($('#yearsSummary').val() == '-'){
            $('#summaryYearTitle').html('TODO')
        }else{
            $('#summaryYearTitle').html($('#yearsSummary').val())
        }
        getSummary($('#yearsSummary').val())
    })

    $('#yearsSummary').change(function(){
        if($('#yearsSummary').val() == '-'){
            $('#summaryYearTitle').html('TODO')
        }else{
            $('#summaryYearTitle').html($(this).val())
        }
        getSummary($(this).val())
    })

    // RESÚMENES
    $('#goSumaryGeneralStatistics').click(function(){
        getStatisticGeneralData()
    })

    // CREMACIONES
    $('#goCremations').click(function(){
        if(cremationsTableLoad){
            cremations.ajax.url(uri + "core/statistics/generals/getCremations.php?year=" + $(this).val()).load()
        }else{
            cremations = $('#cremations-table').DataTable({
                "ajax": uri + "core/statistics/generals/getCremations.php?year=" + $("#yearsCremations").val(),
                "responsive": false,
                "pageLength": 25,
                "autoWidth": true,
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                "columns": [
                    {"title": "Fecha solicitud"},
                    {"title": "Expediente"},
                    {"title": "Nombre"},
                    {"title": "Crematorio"},
                    {"title": "Fecha cremación"}
                ],
                "columnDefs": [
                    {
                        "targets": [0, 4],
                        "render": function(data, type, row){
                            if(type === 'display' || type === 'filter'){
                                return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                            }
                            return data == null ? 0 : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                        }
                    }
                ],
                "dom": 'rt<"bottom bottom-2"Bp><"clear">',
                "buttons": [{
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'Estadísticas generales - Cremaciones',
                    title: 'Estadísticas generales - Cremaciones',
                    text: 'Excel <i class="fa fa-file-excel-o"></i>',
                    className: 'c-lile export-button'
                },
                {
                    extend: 'pdfHtml5',
                    orientation: 'portrait',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'Estadísticas generales - Cremaciones',
                    title: 'Estadísticas generales - Cremaciones',
                    customize: function(doc){
                        // Limpia la plantilla por defecto
                        doc.content.splice(0, 1)
        
                        // Configuración
                        doc.pageMargins = [30, 60, 30, 50]
                        doc.defaultStyle.fontSize = 10
        
                        // Header
                        doc['header'] = (function(){
                            return {
                                columns: [{
                                    alignment: 'left',
                                    text: 'Listado de estadísticas generales - cremaciones',
                                    bold: true,
                                    fontSize: 12
                                },
                                {
                                    alignment: 'right',
                                    text: moment().format('DD/MM/YYYY HH:mm'),
                                    fontSize: 10
                                }],
                                margin: 30
                            }
                        })
        
                        // Footer
                        doc['footer'] = (function(page, pages){
                            return {
                                columns: [{
                                    alignment: 'center',
                                    text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                    fontSize: 10
                                }],
                                margin: 20
                            }
                        })
                    },
                    text: 'PDF <i class="fa fa-file-pdf-o"></i>',
                    className: 'c-lile export-button'
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize: function(win){
                        $(win.document.body).find('h1').css('display','none')
                    },
                    text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                    className: 'c-lile export-button'
                }],
            })
            
            cremationsTableLoad = true
        }
    })

    // DATOS - BÚSQUEDA
    $('#input-search-cremations').on('keyup', function(){
        cremations.search(this.value).draw()
    })

    // AÑOS
    $('#yearsCremations').change(function(){
        $("#cremations-table tbody").empty()
        if(yearsCremationsFlag){
            cremations.ajax.url(uri + "core/statistics/generals/getCremations.php?year=" + $(this).val()).load()
        }
    })

    // Exportar
    // Datos - Defunciones totales
    $('#exportDataTotalDeceasedWeek').click(function(){
        var data = []

        $('#deceased-table > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceased-table > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedWeek',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_totales_semana.csv', '_blank')
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
        })
    })

    $('#exportDataTotalDeceasedTotal').click(function(){
        var data = []

        $('#deceased-table > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceased-total-table > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedTotal',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_totales.csv', '_blank')
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
        })
    })

    $('#exportDataTotalDeceasedChartDay').click(function(){
        var canvas = document.getElementById("totalDeceasedChart")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_por_dia.png");
        a.setAttribute("href", data);
        a.appendChild(img);
        a.click()
        a.remove()
    })

    $('#exportDataTotalDeceasedChartVs').click(function(){
        var canvas = document.getElementById("dayNightDeceasedChart")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_por_dia.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    
    // Datos - Defunciones por año
    $('#exportDataTotalDeceasedByYearD').click(function(){
        var data = []

        $('#deceasedByYearTableD' + ' > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceasedByYearTableD' + ' > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedByYear',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_por_ano.csv', '_blank')
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
        })
    })
    $('#exportDataTotalDeceasedByYearC').click(function(){
        var data = []

        $('#deceasedByYearTableC' + ' > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceasedByYearTableC' + ' > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedByYear',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_por_ano.csv', '_blank')
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
        })
    })
    $('#exportDataTotalDeceasedByYearS').click(function(){
        var data = []

        $('#deceasedByYearTableS' + ' > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceasedByYearTableS' + ' > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedByYear',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_por_ano.csv', '_blank')
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
        })
    })
    $('#exportDataTotalDeceasedByYearDS').click(function(){
        var data = []

        $('#deceasedByYearTableDS' + ' > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceasedByYearTableDS' + ' > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedByYear',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_por_ano.csv', '_blank')
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
        })
    })

    $('#exportDataTotalDeceasedByYearChartD').click(function(){
        var canvas = document.getElementById("deceasedByYearChartD")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_totales_por_dia_en_"+$("#deceasedByYearChartYearsD").val()+".png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    $('#exportDataTotalDeceasedByYearChartC').click(function(){
        var canvas = document.getElementById("deceasedByYearChartC")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_cremaciones_por_dia_en_"+$("#deceasedByYearChartYearsC").val()+".png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    $('#exportDataTotalDeceasedByYearChartS').click(function(){
        var canvas = document.getElementById("deceasedByYearChartS")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_sala_por_dia_en_"+$("#deceasedByYearChartYearsS").val()+".png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    $('#exportDataTotalDeceasedByYearChartDS').click(function(){
        var canvas = document.getElementById("deceasedByYearChartDS")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_propias_por_dia_en_"+$("#deceasedByYearChartYearsDS").val()+".png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    // Datos - Defunciones día
    $('#exportDataTotalDeceasedDay').click(function(){
        var data = []

        $('#deceasedByYearDayTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceasedByYearDayTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedDay',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_dia.csv', '_blank')
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
        })
    })

    $('#exportDataTotalDeceasedDayChart').click(function(){
        var canvas = document.getElementById("deceasedByYearDayChart")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_por_dia.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    
    // Datos - Defunciones noche
    $('#exportDataTotalDeceasedNight').click(function(){
        var data = []

        $('#deceasedByYearNightTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#deceasedByYearNightTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDeceasedNight',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_noche.csv', '_blank')
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
        })
    })

    $('#exportDataTotalDeceasedNightChart').click(function(){
        var canvas = document.getElementById("deceasedByYearNightChart")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_por_noche.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    
    // Datos - Día vs noche
    $('#exportDataTotalDayvsnight').click(function(){
        var data = []

        $('#dayvsnightTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#dayvsnightTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalDayvsnight',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_diaVSnoche.csv', '_blank')
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
        })
    })

    $('#exportDataTotalDayvsnightMonday').click(function(){
        var canvas = document.getElementById("dayvsnightChartMonday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_lunes.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightTuesday').click(function(){
        var canvas = document.getElementById("dayvsnightChartTuesday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_martes.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightWednesday').click(function(){
        var canvas = document.getElementById("dayvsnightChartWednesday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_miercoles.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightThursday').click(function(){
        var canvas = document.getElementById("dayvsnightChartThursday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_jueves.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightFriday').click(function(){
        var canvas = document.getElementById("dayvsnightChartFriday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_viernes.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightSaturday').click(function(){
        var canvas = document.getElementById("dayvsnightChartSaturday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_sabado.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightSunday').click(function(){
        var canvas = document.getElementById("dayvsnightChartSunday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_domingo.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalDayvsnightAverage').click(function(){
        var canvas = document.getElementById("dayvsnightChartAverage")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_media.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    
    // Datos - Noche vs día
    $('#exportDataTotalNightvsday').click(function(){
        var data = []

        $('#nightvsdayTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#nightvsdayTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalNightvsday',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_nocheVSdia.csv', '_blank')
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
        })
    })

    $('#exportDataTotalNightvsdayMonday').click(function(){
        var canvas = document.getElementById("nightvsdayChartMonday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_lunes.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdayTuesday').click(function(){
        var canvas = document.getElementById("nightvsdayChartTuesday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_martes.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdayWednesday').click(function(){
        var canvas = document.getElementById("nightvsdayChartWednesday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_miercoles.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdayThursday').click(function(){
        var canvas = document.getElementById("nightvsdayChartThursday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_jueves.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdayFriday').click(function(){
        var canvas = document.getElementById("nightvsdayChartFriday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_viernes.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdaySaturday').click(function(){
        var canvas = document.getElementById("nightvsdayChartSaturday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_sabado.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdaySunday').click(function(){
        var canvas = document.getElementById("nightvsdayChartSunday")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_domingo.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })

    $('#exportDataTotalNightvsdayAverage').click(function(){
        var canvas = document.getElementById("nightvsdayChartAverage")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_noche_vs_dia_media.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })
    
    // Datos - Crematorios
    $('#exportDataTotalCrematoriums').click(function(){
        var data = []

        $('#crematoriumsTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        data.push(['Año', 'Incineraciones', 'Cremaciones', '%'])

        $('#crematoriumsTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalCrematoriums',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_resumen_dias.csv', '_blank')
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
        })
    })

    $('#exportDataTotalCrematoriumsOwnServices').click(function(){
        var data = []

        $('#crematoriumsOwnServiceTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        if($('#Owncrematoriums').val() != null){
            data.push( [$("#Owncrematoriums").select2('data')[0].text]);
        }

        data.push(['Año', 'Servicios', 'Incineraciones', '%'])

        $('#crematoriumsOwnServiceTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalCrematoriumsOwnServices',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_crematorios_propios.csv', '_blank')
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
        })
    })

    $('#exportDataTotalCrematoriumsOutServices').click(function(){
        var data = []

        $('#crematoriumsOutServiceTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        if($('#Outcrematoriums').val() != null){
            data.push( [$("#Outcrematoriums").select2('data')[0].text]);
        }

        data.push(['Año', 'Servicios', 'Incineraciones', '%'])

        $('#crematoriumsOutServiceTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalCrematoriumsOutServices',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_crematorios_externos.csv', '_blank')
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
        })
    })

    // EXPORT CREMACIONES
    $('#exportDataTotalCrematoriumsMonthDay').click(function(){
        var data = []

        $('#crematoriumsMonthDayTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        if($('#monthCremations').val() != null && $('#monthCremations').val() != '0'){
            data.push( [months[$('#monthCremations').val()] + ' ' + $("#yearCremations").val()]);
        }else{
            data.push( [$("#yearCremations").val()]);
        }

        data.push(['Año', 'Mes', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 'Total cremaciones', 'Total días CON cremación', 'Total días SIN cremación'])

        $('#crematoriumsMonthDayTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalCrematoriumsMonthsDays',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_cremaciones_mes_anho.csv', '_blank')
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
        })
    })

    $('#exportDataTotalCrematoriumsDaysWeek').click(function(){
        var data = []

        $('#crematoriumsDaysWeekTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        if($('#monthCremationsWeek').val() != null && $('#monthCremationsWeek').val() != '0'){
            data.push( [months[$('#monthCremationsWeek').val()] + ' ' + $("#yearCremationsWeek").val()]);
        }else{
            data.push( [$("#yearCremationsWeek").val()]);
        }

        data.push(['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'])

        $('#crematoriumsDaysWeekTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalCrematoriumsWeek',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_cremaciones_semana.csv', '_blank')
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
        })
    })

    // EXPORT JUDICIALES
    $('#exportDataTotalJudicialesMonthDay').click(function(){
        var data = []

        $('#judicialesMonthDayTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        if($('#monthJudiciales').val() != null && $('#monthJudiciales').val() != '0'){

            if($('#departureJudiciales').prop('checked') && $('#returnJudiciales').prop('checked')){
                data.push( [months[$('#monthJudiciales').val()] + ' ' + $("#yearJudiciales").val() + ' con traslado y devolución']);
            }else if($('#departureJudiciales').prop('checked') && !$('#returnJudiciales').prop('checked')){
                data.push( [months[$('#monthJudiciales').val()] + ' ' + $("#yearJudiciales").val() + ' con traslado']);
            }else if($('#departureJudiciales').prop('checked') && $('#returnJudiciales').prop('checked')){
                data.push( [months[$('#monthJudiciales').val()] + ' ' + $("#yearJudiciales").val() + ' con devolución']);
            }else{
                data.push( [months[$('#monthJudiciales').val()] + ' ' + $("#yearJudiciales").val()]);
            }
        }else{
            if($('#departureJudiciales').prop('checked') && $('#returnJudiciales').prop('checked')){
                data.push( [$("#yearJudiciales").val() + ' con traslado y devolución']);
            }else if($('#departureJudiciales').prop('checked') && !$('#returnJudiciales').prop('checked')){
                data.push( [$("#yearJudiciales").val() + ' con traslado']);
            }else if($('#departureJudiciales').prop('checked') && $('#returnJudiciales').prop('checked')){
                data.push( [$("#yearJudiciales").val() + ' con devolución']);
            }else{
                data.push( [$("#yearJudiciales").val()]);
            }
        }

        data.push(['Año', 'Mes', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 'Total judiciales', 'Total días CON judiciales', 'Total días SIN judiciales',])

        $('#judicialesMonthDayTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalJudicialesMonthsDays',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_judiciales_mes_anho.csv', '_blank')
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
        })
    })

    $('#exportDataTotalJudicialesDaysWeek').click(function(){
        var data = []

        $('#judicialesDaysWeekTable > thead > tr > th').each(function(){
            data.push([$(this).text()])
            return false
        })

        if($('#monthJudicialesWeek').val() != null && $('#monthJudicialesWeek').val() != '0'){

            if($('#departureJudicialesWeek').prop('checked') && $('#returnJudicialesWeek').prop('checked')){
                data.push( [months[$('#monthJudicialesWeek').val()] + ' ' + $("#yearJudicialesWeek").val() + ' con traslado y devolución']);
            }else if($('#departureJudicialesWeek').prop('checked') && !$('#returnJudicialesWeek').prop('checked')){
                data.push( [months[$('#monthJudicialesWeek').val()] + ' ' + $("#yearJudicialesWeek").val() + ' con traslado']);
            }else if($('#departureJudicialesWeek').prop('checked') && $('#returnJudicialesWeek').prop('checked')){
                data.push( [months[$('#monthJudicialesWeek').val()] + ' ' + $("#yearJudicialesWeek").val() + ' con devolución']);
            }else{
                data.push( [months[$('#monthJudicialesWeek').val()] + ' ' + $("#yearJudicialesWeek").val()]);
            }
        }else{
            if($('#departureJudicialesWeek').prop('checked') && $('#returnJudicialesWeek').prop('checked')){
                data.push( [$("#yearJudicialesWeek").val() + ' con traslado y devolución']);
            }else if($('#departureJudicialesWeek').prop('checked') && !$('#returnJudicialesWeek').prop('checked')){
                data.push( [$("#yearJudicialesWeek").val() + ' con traslado']);
            }else if($('#departureJudicialesWeek').prop('checked') && $('#returnJudicialesWeek').prop('checked')){
                data.push( [$("#yearJudicialesWeek").val() + ' con devolución']);
            }else{
                data.push( [$("#yearJudicialesWeek").val()]);
            }
        }

        data.push(['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'])

        $('#judicialesDaysWeekTable > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataTotalJudicialesWeek',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_judiciales_semana.csv', '_blank')
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
        })
    })

    // Resumen
    $('#exportDataSummaryDays').click(function(){
        var data = []

        $('#summary-table > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#summary-table > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataSummaryDays',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_defunciones_crematorios.csv', '_blank')
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
        })
    })

    $('#exportDataSummaryTotal').click(function(){
        var data = []

        $('#summary-total-table > thead > tr > th').each(function(){
            data.push([$(this).text()])
        })

        $('#summary-total-table > tbody > tr').each(function(){
            var row = []
            var tr = $(this).find('td')
            $.each(tr, function(){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDataSummaryTotal',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/datos_resumen_total.csv', '_blank')
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
        })
    })

    $('#exportDataTotalSummaryChart').click(function(){
        var canvas = document.getElementById("summaryChart")
        var data = canvas.toDataURL("image/png", 1.0);

        var img = document.createElement('img');
        img.src = data;

        var a = document.createElement('a');
        a.setAttribute("download", "defunciones_resumen.png");
        a.setAttribute("href", data);
        a.appendChild(img);

        a.click()

        a.remove()
    })


    /** **************** Exportar **************** */
    $('#exportGeneralsStatistics').click(function(){
        var generalStatistics = new Array
      
        $('#general-table > tbody > tr').each(function(index, elem){
            var row = new Array
            $(this).find('td').each(function(index, elem){
                row.push($(this).text())
            })
            generalStatistics.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportGeneralStatistics',
                data: generalStatistics
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    window.open(uri + 'descargar-archivoExcel?file=statistics/generalStatistics.csv', '_blank')
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
        })
    })
    /** **************** Exportar **************** */
    $('#exportDataClientStats').click(function(){
        var generalStatisticsClient = new Array

        $('#general-expedients-table > tbody > tr').each(function(index, elem){
            var row = new Array
            $(this).find('td').each(function(index, elem){
                row.push($(this).text())
            })
            generalStatisticsClient.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportGeneralStatisticsClient',
                data: generalStatisticsClient
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    window.open(uri + 'descargar-archivoExcel?file=statistics/generalStatistics1.csv', '_blank')
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
        })
    })
})