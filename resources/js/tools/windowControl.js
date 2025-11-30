/** @var {array} user User info */
var user = null;



/**
 * Obtiene los usuarios online
 */
function getUsersOnline(){
    $.ajax({
        url: uri+"core/users/functions2.php",
        data: {type: 'getUsersOnline'},
        type: 'POST',
        async: false,
        success: function (data) {
            var users = $.parseJSON(data);
            $('#numUsers').html(users.length);
            
            $('#numUsersHeader').html('Hay ' + users.length + ' usuario'+(users.length == 1 ? '' : 's')+' conectados');
            
            $('#nameUsers').empty();
            for(var i = 0; i < users.length; i++){
                $('#nameUsers').append("<li><a href='#'><i class='fa fa-circle text-success'></i>" + users[i]['username'] + "</a></li>");
            }
        }
    });
}

/**
 * Obtiene los usuarios que hay en una página
 */
function getUsersOnPage(){
    $.ajax({
        url: uri+"core/users/functions2.php",
        type: 'POST',
        data: {
            type: 'areUsers',
            page: window.location.pathname
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data);

            $('#usersOnPage').empty()
            if(data != null){
                $('#usersOnPageBtn').html('Usuarios en esta página (' + data.length + ')');
                $.each(data, function(index, elem){
                    $('#usersOnPage').append('<li><a>' + elem.username + '</a></li>');
                })
            }
        }
    });
}

$(function(){
    
    //--------------------------------- OPTIMIZACION -----------------------------------
    $.ajax({
        url: uri+"core/users/windowControl.php",
        data: {page: window.location.pathname, type: 'getInfo'},
        type: 'POST',
        async: true,
        success: function (data) {
            var info = $.parseJSON(data);
            
            //Obtención de los datos el usuario en sesion
            user = info['getUser']
            if(user != null){
                $('#userName').html(user[0]['name']);
                $('#userType').html(user[0]['type']);                           
            }

            //Obtener los usuarios online
            var users = info['getUsersOnline'];
            $('#numUsers').html(users.length);

            $('#numUsersHeader').html('Hay ' + users.length + ' usuario'+(users.length == 1 ? '' : 's')+' conectados');
            
            $('#nameUsers').empty()
            for(var i = 0; i < users.length; i++){
                $('#nameUsers').append("<li><a href='#'><i class='fa fa-circle text-success'></i>" + users[i]['username'] + "</a></li>");
            }

            //Obtener usuarios en la página            
            $('#usersOnPage').empty()
            if(info['areUsers'] != null){
                $('#usersOnPageBtn').html('Usuarios en esta página (' + info['areUsers'].length + ')')
                $.each(info['areUsers'], function(index, elem){
                    $('#usersOnPage').append('<li><a>' + elem.username + '</a></li>')
                })
            }
        }
    });
});

var noEditors = true;
$.each(urls, function(index, value){
    if(url.match(value)){
        var aux = url.split('/')
        aux.length = aux.length - 1
        url = ''
        $.each(aux, function(i){
            url += aux[i] + '/'
        })
        url = url.substring(0, url.length - 1)
        switch(value){
            case 'expediente/esquela/editor':
            case 'expediente/esquela-prensa/editor':
            case 'expediente/lapida/editor':
            case 'expediente/recordatorio':
            case 'expediente/recordatorio/editor':
            case 'expediente/recordatorio-sobre/editor':
            case 'expediente/recordatorio-sobre-cruz/editor':
            case 'expediente/cerrado-defuncion/editor':
            case 'expediente/no-recibe-duelo/editor':
                noEditors = false;
            break
        }
    }
})

if(noEditors){
    window.onbeforeunload = (e) => {
        var formData = new FormData;
    
        formData.append('page', window.location.pathname);
        formData.append('type', 'deleteCurrentPage');
    
        navigator.sendBeacon(
            '/core/users/functions2.php',
            formData
        )
    }
}