/**
 * Comprueba si una cadena tiene formato de correo electrónico
 * 
 * @param {string} email Correo electrónico
 * @return {boolean}
 */
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regex.test(email)
}

/**
 * Recuperar contraseña
 * 
 * @param {string} cif CIF
 * @param {string} email Correo
 */
function goPassword(cif, email){
    var data = {
        cif: cif,
        email: email
    }

    $.ajax({
        url: uri + 'core/login/passForgotten.php',
        method: 'POST',
        data: data,
        async: false,
        dataType: 'json',
        success: function(data){
            try{
                switch(data){
                    case true:
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha enviado su nueva contraseña a su dirección de correo electrónico</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                        break

                    case 'company':
                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La empresa no existe. Por favor, introduzca otro CIF</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                        break

                    case 'notfound':
                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El correo introducido no existe</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                        break
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

    $('#email').val('')
    $('#modal-remember').modal('hide')
}

/**
 * Login
 * 
 * @param {string} cif CIF
 * @param {string} username Nombre de usuario
 * @param {password} password Contraseña
 */
function goLogin(cif, username, password){
    var data = {
        cif: cif,
        username: username,
        password: password
    }

    $.ajax({
        url: uri + 'core/login/login.php',
        method: 'POST',
        data: data,
        async: false,
        dataType: 'json',
        success: function(data){
            try{
                switch(data){
                    case true:
                        window.localStorage.setItem('LETS_FUNER', 'true')
                        window.location.href = uri + 'info';
                    break;
                    case "company":
                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La empresa no existe. Por favor, introduzca otro CIF</div>');

                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    break
                    case "username":
                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El usuario no existe</div>');

                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    break
                    case "password":
                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La contraseña no es correcta</div>');

                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    break
                    default:
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    break;
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
        }
    })
}

$(window).on("load", function(){
    if(readCookie('user') == 'false' || readCookie('user') == false || readCookie('user') == null || readCookie('user') == 'null'){
        $('.login-page').removeClass('hide')
        // document.getElementById("username").focus();
    }else{
        $.ajax({
            url: uri + 'core/login/functions.php',
            method: 'POST',
            data: {
                type: 'getUser'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
                if(data){
                    window.location.href = uri + 'info'
                }else{
                    $('.login-page').removeClass('hide')
                }
            }
        })
        
        document.getElementById("username").focus();
    }
})
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
    // Acceso
    $('.login-box').keypress(function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which)
        // Key -> 'Enter'
        if(keycode == '13'){
            $('#goLogin').click()
        }
    })

    $('#goLogin').click(function(){
        var validate = 0

        var cif = $('#cif').val()
        var username = $('#username').val()
        var password = $('#password').val()

        if(cif == ''){
            $('#cifError').removeClass('hide')
            validate++
        }else{
            $('#cifError').addClass('hide')
        }

        if(username == ''){
            $('#usernameError').removeClass('hide')
            validate++
        }else{
            $('#usernameError').addClass('hide')
        }

        if(password == ''){
            $('#passwordError').removeClass('hide')
            validate++
        }else{
            $('#passwordError').addClass('hide')
        }

        if(validate == 0){
            goLogin(cif, username, password)
        }
    })

    // Recuperar contraseña
    $('#modal-remember').keypress(function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which)
        // Key -> 'Enter'
        if(keycode == '13'){
            $('#goPassword').click()
        }
    })

    $('#goPassword').click(function(){
        var validate = 0

        var cif = $('#cifPassword').val()
        var email = $('#email').val()

        if(cif == ''){
            $('#cifEmpty').removeClass('hide')
            validate++
        }else{
            $('#cifEmpty').addClass('hide')
        }

        if(email == ''){
            validate++
            $('#emailEmpty').removeClass('hide')
            $('#emailFormat').addClass('hide')
        }else if(!isEmail(email)){
            validate++
            $('#emailFormat').removeClass('hide')
            $('#emailEmpty').addClass('hide')
        }else{
            $('#emailEmpty').addClass('hide')
            $('#emailFormat').addClass('hide')
        }

        if(validate == 0){
            goPassword(cif, email)
        }
    })

    changeSpaceFooter()

    $(window).on('storage', function(){
        if(window.localStorage.getItem('LETS_FUNER') == 'true'){
            window.location.reload()
        }
    })
})