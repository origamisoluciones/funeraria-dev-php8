/** @const LETS Lets local storage */
const LETS = 'LETS_FUNER'

/** @const SESSION_TIMEOUT_WARNING Set session timeout warning */
const SESSION_TIMEOUT_WARNING = 180

/** @const SESSION_STORAGE Store session storage name (local storage) */
const SESSION_STORAGE = 'session_funer'

/** @var {int} sessionCont Session cont */
var sessionCont = 0

/** @var {int} sessionFlag Session flag */
var sessionFlag = false

/*
 * Function for adjust dimmensions fixed static toolbar
 */ 
function setWidthBottomToolbar(){    
    //Vertical Scrollbar
    var scrollHeight = document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var hasVerticalScrollbar = scrollHeight > clientHeight;
   
    var wWindow = window.innerWidth;
    var wSidebar = $(".main-sidebar").innerWidth();
    if(hasVerticalScrollbar){
        $(".footer-static-bottom").innerWidth(wWindow - wSidebar - 12);
    }else{
        $(".footer-static-bottom").innerWidth(wWindow - wSidebar);
    }
    $(".footer-static-bottom").css("left", wSidebar);
    return true;
}

/**
 * Actualiza la fecha de ultima actividad
 * 
 * @returns {boolean}
 */
function updateLastActivity(){
    $.ajax({
        url: uri + 'core/info/functions.php',
        method: 'POST',
        data: {
            type: 'updateLastActivity'
        },
        async: false
    })

    $.ajax({
        url: uri+"core/users/windowControl.php",
        data: {page: window.location.pathname, type: 'getInfoRefreshSession'},
        type: 'POST',
        async: false
    })
}

$(function(){

    // Checks session expired
    if(
        window.location.pathname != '/inicio' && 
        window.location.pathname != '/timeline' &&
        window.location.pathname != '/editor-documentos'
    ){
        window.localStorage.setItem(SESSION_STORAGE, 0)

        var intervalSession = setInterval(() => {
            if(parseInt(window.localStorage.getItem(SESSION_STORAGE)) == sessionCont){
                sessionCont++
                window.localStorage.setItem(SESSION_STORAGE, sessionCont)
            }else{
                sessionCont = parseInt(window.localStorage.getItem(SESSION_STORAGE))
            }

            var percentage = parseInt(parseFloat((SESSION_TIMEOUT + (sessionFlag ? SESSION_TIMEOUT_WARNING : 0) - parseInt(window.localStorage.getItem(SESSION_STORAGE))) * 100 / ((sessionFlag ? SESSION_TIMEOUT_WARNING : SESSION_TIMEOUT))).toFixed(0))
            $('#sessionProgressBar').css('width', percentage + '%')
            $('#sessionProgressBar').attr('aria-valuenow', percentage)
            $('#barPercentage').text((SESSION_TIMEOUT + (sessionFlag ? SESSION_TIMEOUT_WARNING : 0) - parseInt(window.localStorage.getItem(SESSION_STORAGE))) + ' s')

            if(sessionFlag){
                if(sessionCont >= SESSION_TIMEOUT + SESSION_TIMEOUT_WARNING){
                    // Force logout
                    clearInterval(intervalSession)

                    setTimeout(() => {
                        $('#goLogout').click()
                    }, 25)
                }
            }else{
                if(sessionCont >= SESSION_TIMEOUT){
                    sessionFlag = true
                    $('#warningSessionModal').modal('show')
                }
            }
        }, 1000)

        // Warning session
        $('#avoidWarningSession').click(function(){
            sessionFlag = false
            sessionCont = 0
            window.localStorage.setItem(SESSION_STORAGE, sessionCont)

            // Update last activity
            updateLastActivity();
            $('#warningSessionModal').modal('hide')
        })

        $(window).on('storage', function(){
            if(window.localStorage.getItem(LETS) != 'true'){
                $('#goLogout').click()
            }
            if(window.localStorage.getItem(SESSION_STORAGE) == undefined){
                $('#goLogout').click()
            }
            if(parseInt(window.localStorage.getItem(SESSION_STORAGE)) >= SESSION_TIMEOUT){
                $('#warningSessionModal').modal('show')
            }
            if(parseInt(window.localStorage.getItem(SESSION_STORAGE)) == 0){
                sessionFlag = false
                sessionCont = 0
                $('#warningSessionModal').modal('hide')
            }

            var percentage = parseInt(parseFloat(((sessionFlag ? SESSION_TIMEOUT + SESSION_TIMEOUT_WARNING : SESSION_TIMEOUT) - parseInt(window.localStorage.getItem('session'))) * 100 / ((sessionFlag ? SESSION_TIMEOUT + SESSION_TIMEOUT_WARNING : SESSION_TIMEOUT))).toFixed(0))
            $('#footerActionsLeft #sessionProgressBar').css('width', percentage + '%')
            $('#footerActionsLeft #sessionProgressBar').attr('aria-valuenow', percentage)
            $('#footerActionsLeft #barPercentage').text('Sesión (' + ((sessionFlag ? SESSION_TIMEOUT + SESSION_TIMEOUT_WARNING : SESSION_TIMEOUT) - parseInt(window.localStorage.getItem('session'))) + ' segundos)')
        })

        $('.goLogoutWarning').click(function(){
            $('#goLogout').click()
        })
    }
})