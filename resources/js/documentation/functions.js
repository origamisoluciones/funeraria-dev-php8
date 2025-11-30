/**
 * @var {string} currentDirectory Directorio actual
 */
var currentDirectory = '/'

/**
 * @var {array} scan Contenido del directorio
 */
var scan

/**
 * @var {name} name Nombre actual de la carpeta a editar
 */
var folderName

/**
 * Scanea un directorio actual
 * 
 * @param {string} directory Directorio
 * @return {array} response Contenido del directorio
 */
function scanDirectory(directory){
    var response = null

    $.ajax({
        url: uri + 'core/documentation/list.php',
        method: 'POST',
        data: {
            directory: directory
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    return response
}

/**
 * Rellena la tabla con el contenido del directorio
 * 
 * @param {array} scan Contenido scaneado
 */
function printScan(scan){
    $('#currentUrl').html(currentDirectory)
    $('#docsBody').empty()

    if(scan.length == 0){

        $('#docsBody').append(
            '   <tr>' +
            '       <td colspan="6" style="text-align:left">No existen ficheros ni directorios</td>' +
            '   </tr>')

    }else{
        $.each(scan, function(index, elem){
            var type = elem[0]
            var name = elem[1]
            var date = moment(elem[2], 'X').format('DD/MM/YYYY HH:mm')
    
            var img = ''
            var delSecret = ''
            if(type == 'folder'){
                $.ajax({
                    url: uri + 'core/documentation/functions.php',
                    method: 'POST',
                    data: {
                        type: 'hasAccess',
                        path: currentDirectory,
                        folder: name
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
    
                            if(data){
                                delSecret = ' <button class="btn btn-danger" id="delSecret' + index + '"><i class="fa fa-ban" aria-hidden="true"></i></button>'
                                img = '<i class="fa fa-folder c-red" aria-hidden="true"></i> <i class="fa fa-key" aria-hidden="true"></i>'
                            }else{
                                img = '<i class="fa fa-folder c-red" aria-hidden="true"></i>'
                            }
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
            }
    
            switch(type){
                case 'file':
                    img = '<i class="fa fa-file" aria-hidden="true"></i>'
                    var edit = '<td></td>'
                    var secret = '<td class="secretFolder"></td>'
                break
                case 'folder':
                    var edit = '<td><button class="btn btn-primary" id="edit' + index + '"><i class="fa fa-edit" aria-hidden="true"></i></button></td>'
                    var secret =    
                        '   <td class="secretFolder">' +
                        '       <button class="btn btn-warning" id="saveSecret' + index + '"><i class="fa fa-key" aria-hidden="true"></i></button>' +
                            delSecret +
                        '   </td>'
                break
            }
            
            $('#docsBody').append(
                '   <tr>' +
                '       <td>' + img + '</td>' +
                '       <td class="showCursor" id="go' + type + index + '">' + name + '</td>' +
                '       <td>' + date + '</td>' +
                    edit +
                '       <td><button class="btn btn-danger" id="del' + index + '"><i class="fa fa-trash" aria-hidden="true"></i></button></td>' +
                    secret +
                '   </tr>'
            )
    
            $('#go' + type + index).click(function(){
                switch(type){
                    case 'file':
                        window.open(uri + 'descargar-archivo?file=documentation' + currentDirectory + name, '_blank')
                    break
                    case 'folder':
                        var hasAccess = true
                        $.ajax({
                            url: uri + 'core/documentation/functions.php',
                            method: 'POST',
                            data: {
                                type: 'hasAccess',
                                path: currentDirectory,
                                folder: name
                            },
                            async: false,
                            success: function(data){
                                try{
                                    data = $.parseJSON(data)
                                    if(data){
                                        hasAccess = false
                                    }
                                }catch(e){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            },
                            error: function(){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })
                        if(hasAccess){
                            currentDirectory += name + '/'
                            $('#docsBody').empty()
                            scan = scanDirectory(currentDirectory)
                            printScan(scan)
                            if(scan.length == 0){
                                $('#docsBody').append(  
                                    '   <tr>' +
                                    '       <td style="text-align: left;" colspan="6">El directorio está vacío</td>' +
                                    '   </tr>')
                            }
                        }else{
                            $('#modal-password #dirpath').val(currentDirectory)
                            $('#modal-password #name').val(name)
    
                            $('#modal-password').modal('show')
                        }
                    break
                }
            })
    
            $('#edit' + index).click(function(){
                var hasAccess = true
                $.ajax({
                    url: uri + 'core/documentation/functions.php',
                    method: 'POST',
                    data: {
                        type: 'hasAccess',
                        path: currentDirectory,
                        folder: name
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
    
                            if(data){
                                hasAccess = false
                            }
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
                folderName = name
                if(hasAccess){
                    $('#modal-edit-folder #folder').val(name)
    
                    $('#modal-edit-folder').modal('show')
                }else{
                    $('#modal-password-edit #dirpath').val(currentDirectory)
                    $('#modal-password-edit #name').val(name)
    
                    $('#modal-password-edit').modal('show')
                }
            })
    
            $('#del' + index).click(function(){
                switch(type){
                    case 'file':
                        if(confirm('¿Desea eliminar el archivo ' + name + '?')){
                            $.ajax({
                                url: uri + 'core/documentation/delete.php',
                                method: 'POST',
                                data: {
                                    directory: currentDirectory,
                                    name: name,
                                    type: type
                                },
                                async: false,
                                success: function(data){
                                    try{
                                        data = $.parseJSON(data)
    
                                        if(data){
                                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El archivo se ha eliminado con éxito.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
    
                                            scan = scanDirectory(currentDirectory)
                                            printScan(scan)
                                        }else{
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    }catch(e){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            })
                        }
                    break
                    case 'folder':
                        var hasAccess = true
                        $.ajax({
                            url: uri + 'core/documentation/functions.php',
                            method: 'POST',
                            data: {
                                type: 'hasAccess',
                                path: currentDirectory,
                                folder: name
                            },
                            async: false,
                            success: function(data){
                                try{
                                    data = $.parseJSON(data)
            
                                    if(data){
                                        hasAccess = false
                                    }
                                }catch(e){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            },
                            error: function(){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })
                        if(hasAccess){
                            if(confirm('¿Desea eliminar la carpeta ' + name + ' y todo su contenido?')){
                                $.ajax({
                                    url: uri + 'core/documentation/delete.php',
                                    method: 'POST',
                                    data: {
                                        directory: currentDirectory + name,
                                        name: name,
                                        type: type
                                    },
                                    async: false,
                                    success: function(data){
                                        try{
                                            data = $.parseJSON(data)
        
                                            if(data){
                                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La carpeta se ha eliminado con éxito.</div>')
                                                setTimeout(function(){
                                                    $('#block-message').empty()
                                                }, 5000)
        
                                                scan = scanDirectory(currentDirectory)
                                                printScan(scan)
                                            }else{
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                setTimeout(function(){
                                                    $('#block-message').empty()
                                                }, 5000)
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        }else{
                            $('#modal-password-delete #dirpath').val(currentDirectory)
                            $('#modal-password-delete #name').val(name)
            
                            $('#modal-password-delete').modal('show')
                        }
                    break
                }
            })
    
            $('#saveSecret' + index).click(function(){
                var hasAccess = true
                $.ajax({
                    url: uri + 'core/documentation/functions.php',
                    method: 'POST',
                    data: {
                        type: 'hasAccess',
                        path: currentDirectory,
                        folder: name
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
    
                            if(data){
                                hasAccess = false
                            }
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
                folderName = name
                if(hasAccess){
                    $('#modal-secret-folder #name').val(name)
                    $('#modal-secret-folder #dirpath').val(currentDirectory)
        
                    $('#modal-secret-folder').modal('show')
                }else{
                    $('#modal-password-change-password #name').val(name)
                    $('#modal-password-change-password #dirpath').val(currentDirectory)
                    
                    $('#modal-password-change-password').modal('show')
                }
            })
    
            $('#delSecret' + index).click(function(){
                $('#modal-password-remove-password #name').val(name)
                $('#modal-password-remove-password #dirpath').val(currentDirectory)
                
                $('#modal-password-remove-password').modal('show')
            })
        })
    }

    if(getUserType() != 1){
        $('.secretFolder').remove()
    }
}

/**
 * Comprueba si una carpeta tiene un formato correcto
 * 
 * @param {string} modal Modal
 * @param {string} folder Folder name
 * @return {int}
 */
function checkFolderName(modal, folder){
    if(folder == ''){
        $('#' + modal + ' #folderError').removeClass('hide')
        return true
    }else{
        if(/^[A-Za-z0-9_-]*$/.test(folder)){
            $('#' + modal + ' #folderError').addClass('hide')
            return false
        }else{
            $('#' + modal + ' #folderError').removeClass('hide')
            return true
        }
    }
}

/**
 * Comprueba si una contraseña tiene un formato correcto
 * 
 * @param {string} modal Modal
 * @param {string} password Password
 * @return {int}
 */
function checkPassword(modal, password){
    if(password == ''){
        $('#' + modal + ' #secretError').removeClass('hide')
        return true
    }else{
        if(/^[A-Za-z0-9_-]*$/.test(password)){
            $('#' + modal + ' #secretError').addClass('hide')
            return false
        }else{
            $('#' + modal + ' #secretError').removeClass('hide')
            return true
        }
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
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    changeSpaceFooter()
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
    
    setWidthBottomToolbar();
    
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    scan = scanDirectory(currentDirectory)
    printScan(scan)

    $('#upLevel').click(function(){
        if(currentDirectory != '/'){
            var dir = currentDirectory.split('/')
            
            dir.shift()
            dir.pop()
            dir.pop()

            currentDirectory = ''
            $.each(dir, function(index, elem){
                currentDirectory += '/' + elem
            })

            currentDirectory += '/'

            scan = scanDirectory(currentDirectory)
            printScan(scan)
        }
    })

    $('#modal-create-folder #saveFolder').click(function(){
        var folder = $('#modal-create-folder #folder').val()

        var validate = 0

        validate += checkFolderName('modal-create-folder', folder)
        
        if(validate == 0){
            $.ajax({
                url: uri + 'core/documentation/checkFolder.php',
                method: 'POST',
                data: {
                    folder: folder,
                    directory: currentDirectory
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        if(data){
                            $('#modal-create-folder #folderNameError').addClass('hide')
                        }else{
                            $('#modal-create-folder #folderNameError').removeClass('hide')
                            validate++
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                        validate++

                        $('#modal-create-folder').modal('hide')
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    validate++

                    $('#modal-create-folder').modal('hide')
                }
            })

            if(validate == 0){
                $.ajax({
                    url: uri + 'core/documentation/createFolder.php',
                    method: 'POST',
                    data: {
                        directory: currentDirectory,
                        folder: folder
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
    
                            if(data){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La carpeta ha sido creada con éxito</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
    
                                scan = scanDirectory(currentDirectory)
                                printScan(scan)

                                $('#modal-create-folder').modal('hide')
                            }else{
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)

                                $('#modal-create-folder').modal('hide')
                            }
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)

                            $('#modal-create-folder').modal('hide')
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        $('#modal-create-folder').modal('hide')
                    }
                })
            }
        }
    })

    $('#modal-create-folder').on('hidden.bs.modal', function(){
        $('#modal-create-folder #folder').val('')
        $('#modal-create-folder #folderError').addClass('hide')
    })

    $('#modal-edit-folder #saveEditFolder').click(function(){
        var folder = $('#modal-edit-folder #folder').val()

        if(folderName == folder){
            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La carpeta ha sido creada con éxito</div>');
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            $('#modal-edit-folder').modal('hide')
        }else{
            var validate = 0
    
            validate += checkFolderName('modal-edit-folder', folder)
            
            if(validate == 0){
                $.ajax({
                    url: uri + 'core/documentation/checkFolder.php',
                    method: 'POST',
                    data: {
                        folder: folder,
                        directory: currentDirectory
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
    
                            if(data){
                                $('#modal-edit-folder #folderNameError').addClass('hide')
                            }else{
                                $('#modal-edit-folder #folderNameError').removeClass('hide')
                                validate++
                            }
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                            validate++
    
                            $('#modal-edit-folder').modal('hide')
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                        validate++
    
                        $('#modal-edit-folder').modal('hide')
                    }
                })
    
                if(validate == 0){
                    $.ajax({
                        url: uri + 'core/documentation/updateFolder.php',
                        method: 'POST',
                        data: {
                            oldFolder: folderName,
                            directory: currentDirectory,
                            folder: folder
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)
        
                                if(data){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La carpeta ha sido creada con éxito</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
        
                                    scan = scanDirectory(currentDirectory)
                                    printScan(scan)
    
                                    $('#modal-edit-folder').modal('hide')
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
    
                                    $('#modal-edit-folder').modal('hide')
                                }
                            }catch(e){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
    
                                $('#modal-edit-folder').modal('hide')
                            }
                        },
                        error: function(){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
    
                            $('#modal-edit-folder').modal('hide')
                        }
                    })
                }
            }
        }
    })

    $('#saveSecretFolder').click(function(){
        var path = $('#modal-secret-folder #dirpath').val()
        var folder = $('#modal-secret-folder #name').val()
        var password = $('#modal-secret-folder #secret').val()
        
        var validate = checkPassword('modal-secret-folder', password)

        if(validate == 0){
            var data = {
                type: 'setPassword',
                path: path,
                folder: folder,
                password: password
            }
    
            $.ajax({
                url: uri + 'core/documentation/functions.php',
                method: 'POST',
                data: data,
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
    
                        if(data){
                            $('#docsBody').empty()
                            scan = scanDirectory(currentDirectory)
                            printScan(scan)
                            if(scan.length == 0){
                                $('#docsBody').append(  '   <tr>' +
                                                        '       <td style="text-align: left;" colspan="6">El directorio está vacío</td>' +
                                                        '   </tr>')
                            }
                            
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La contraseña se ha actualizado correctamente</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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
            })
    
            $('#modal-secret-folder').modal('hide')
        }
    })

    $('#modal-secret-folder').on('hidden.bs.modal', function(){
        $('#modal-secret-folder #secret').val('')
    })

    $('#goPassword').click(function(){
        $('#modal-password #secretError').addClass('hide')

        var path = $('#modal-password #dirpath').val()
        var folder = $('#modal-password #name').val()
        var password = $('#modal-password #secret').val()

        var data = {
            type: 'checkAccess',
            path: path,
            folder: folder,
            password: password
        }

        $.ajax({
            url: uri + 'core/documentation/functions.php',
            method: 'POST',
            data: data,
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){
                        currentDirectory += folder + '/'
                        $('#docsBody').empty()
                        scan = scanDirectory(currentDirectory)
                        printScan(scan)
                        if(scan.length == 0){
                            $('#docsBody').append(  '   <tr>' +
                                                    '       <td style="text-align: left;" colspan="6">El directorio está vacío</td>' +
                                                    '   </tr>')
                        }
                        
                        $('#modal-password').modal('hide')
                    }else{
                        $('#modal-password #secretError').removeClass('hide')
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    $('#modal-password').modal('hide')
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                $('#modal-password').modal('hide')
            }
        })
    })

    $('#modal-password').on('hidden.bs.modal', function(){
        $('#modal-password #secret').val('')
        $('#modal-password #secretError').addClass('hide')
    })

    $('#uploadFileDoc').click(function(){
        $('#formatError').addClass('hide')

        var validate = 0

        var inputFile = document.getElementById('fileAttachDocument')
        var files = inputFile.files

        if(files.length == 0){
            validate++
        }

        $.each(files, function(index, elem){
            var name = elem.name
            var extension = name.split('.')[name.split('.').length - 1]
            switch(extension.toLowerCase()){
                case 'rar':
                case 'zip':
                case 'mp3':
                case 'doc':
                case 'docx':
                case 'dot':
                case 'odt':
                case 'pdf':
                case 'txt':
                case 'xls':
                case 'xlsx':
                case 'ppt':
                case 'pptx':
                case 'csv':
                case 'svg':
                case 'bmp':
                case 'gif':
                case 'jpeg':
                case 'jpg':
                case 'png':
                case 'psd':
                case 'tiff':
                case 'avi':
                case 'flv':
                case 'mkv':
                case 'mpeg':
                    break
                default:
                    validate++
                    $('#formatError').removeClass('hide')
            }
        })
        
        if(validate == 0){             
            var data = new FormData;

            for(var i = 0; i < files.length; i++){                                          
                data.append('file' + i, files[i])           
            }

            data.append('directory', currentDirectory)
             
            $.ajax({
                url: uri + "core/documentation/upload.php",
                type: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                success : function(data){
                    try{
                        data = $.parseJSON(data); 
                                   
                        if(data){
                            $('#block-modal-messages').empty();
                            if(files.length > 20){
                                $('#block-modal-messages').append('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La documentación se ha añadido con éxito, pero solamente se han subido los 20 primeros archivos seleccionados.</div>')
                            }else{
                                $('#block-modal-messages').append('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La documentación se ha añadido con éxito!.</div>')
                            }
                            
                            setTimeout(function(){
                                $('#block-modal-messages').empty()
                            }, 2500)

                            scan = scanDirectory(currentDirectory)
                            printScan(scan)

                            $('#modal-upload-document').modal('hide')
                        }else{
                            $('#block-modal-messages').append('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud con el fichero. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        }
                    }catch(e){
                        $('#block-modal-messages').append('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud con el fichero. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                }
            })
        }
    })

    $('#modal-upload-document').on('hidden.bs.modal', function(){
        $('#modal-upload-document #fileAttachDocument').val('')
        $('#modal-upload-document #formatError').addClass('hide')
    })

    $('#modal-password-edit #goPasswordEdit').click(function(){
        $('#modal-password-edit #secretError').addClass('hide')

        var path = $('#modal-password-edit #dirpath').val()
        var folder = $('#modal-password-edit #name').val()
        var password = $('#modal-password-edit #secret').val()

        var data = {
            type: 'checkAccess',
            path: path,
            folder: folder,
            password: password
        }

        $.ajax({
            url: uri + 'core/documentation/functions.php',
            method: 'POST',
            data: data,
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){                        
                        $('#modal-password-edit').modal('hide')

                        setTimeout(() => {
                            $('#modal-edit-folder #folder').val(name)
    
                            $('#modal-edit-folder').modal('show')
                        }, 250)
                    }else{
                        $('#modal-password-edit #secretError').removeClass('hide')
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    $('#modal-password-edit').modal('hide')
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                $('#modal-password-edit').modal('hide')
            }
        })
    })

    $('#modal-password-delete #goPasswordDelete').click(function(){
        $('#modal-password-delete #secretError').addClass('hide')

        var path = $('#modal-password-delete #dirpath').val()
        var folder = $('#modal-password-delete #name').val()
        var password = $('#modal-password-delete #secret').val()

        var data = {
            type: 'checkAccess',
            path: path,
            folder: folder,
            password: password
        }

        $.ajax({
            url: uri + 'core/documentation/functions.php',
            method: 'POST',
            data: data,
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){                        
                        $('#modal-password-delete').modal('hide')

                        setTimeout(() => {
                            if(confirm('¿Desea eliminar la carpeta ' + folder + ' y todo su contenido?')){
                                $.ajax({
                                    url: uri + 'core/documentation/delete.php',
                                    method: 'POST',
                                    data: {
                                        directory: currentDirectory + folder,
                                        name: folder,
                                        type: 'folder'
                                    },
                                    async: false,
                                    success: function(data){
                                        try{
                                            data = $.parseJSON(data)
                    
                                            if(data){
                                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La carpeta se ha eliminado con éxito.</div>')
                                                setTimeout(function(){
                                                    $('#block-message').empty()
                                                }, 5000)
                    
                                                scan = scanDirectory(currentDirectory)
                                                printScan(scan)
                                            }else{
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                setTimeout(function(){
                                                    $('#block-message').empty()
                                                }, 5000)
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                    
                                $('#modal-password-delete').modal('hide')
                            }
                        }, 250)

                    }else{
                        $('#modal-password-delete #secretError').removeClass('hide')
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    $('#modal-password-delete').modal('hide')
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                $('#modal-password-delete').modal('hide')
            }
        })
    })

    $('#modal-password-change-password #goPasswordChangePassword').click(function(){
        $('#modal-password-change-password #secretError').addClass('hide')

        var path = $('#modal-password-change-password #dirpath').val()
        var folder = $('#modal-password-change-password #name').val()
        var password = $('#modal-password-change-password #secret').val()

        var data = {
            type: 'checkAccess',
            path: path,
            folder: folder,
            password: password
        }

        $.ajax({
            url: uri + 'core/documentation/functions.php',
            method: 'POST',
            data: data,
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){                        
                        $('#modal-password-change-password').modal('hide')

                        setTimeout(() => {
                            $('#modal-secret-folder #name').val(folder)
                            $('#modal-secret-folder #dirpath').val(path)
                
                            $('#modal-secret-folder').modal('show')
                        }, 250)
                    }else{
                        $('#modal-password-change-password #secretError').removeClass('hide')
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    $('#modal-password-change-password').modal('hide')
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                $('#modal-password-change-password').modal('hide')
            }
        })
    })

    $('#modal-password-remove-password #goPasswordRemovePassword').click(function(){
        $('#modal-password-remove-password #secretError').addClass('hide')

        var path = $('#modal-password-remove-password #dirpath').val()
        var folder = $('#modal-password-remove-password #name').val()
        var password = $('#modal-password-remove-password #secret').val()

        var data = {
            type: 'checkAccess',
            path: path,
            folder: folder,
            password: password
        }

        $.ajax({
            url: uri + 'core/documentation/functions.php',
            method: 'POST',
            data: data,
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){                        
                        $('#modal-password-remove-password').modal('hide')

                        setTimeout(() => {
                            if(confirm('¿Desea eliminar la contraseña de la carpeta ' + folder + '?')){
                                $.ajax({
                                    url: uri + 'core/documentation/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'unsetPassword',
                                        path: path,
                                        folder: folder
                                    },
                                    async: false,
                                    success: function(data){
                                        try{
                                            data = $.parseJSON(data)
                
                                            if(data){
                                                $('#docsBody').empty()
                                                scan = scanDirectory(currentDirectory)
                                                printScan(scan)
                                                if(scan.length == 0){
                                                    $('#docsBody').append(  '   <tr>' +
                                                                            '       <td style="text-align: left;" colspan="6">El directorio está vacío</td>' +
                                                                            '   </tr>')
                                                }
                                                
                                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La contraseña se ha eliminado con éxito</div>');
                                                setTimeout(function(){
                                                    $('#block-message').empty()
                                                }, 5000)
                                            }else{
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                setTimeout(function(){
                                                    $('#block-message').empty()
                                                }, 5000)
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }                
                        }, 250)
                    }else{
                        $('#modal-password-remove-password #secretError').removeClass('hide')
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    $('#modal-password-remove-password').modal('hide')
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                $('#modal-password-remove-password').modal('hide')
            }
        })
    })

    $('#searchInput').change(function(){
        var search = $(this).val()
        if(search == ''){
            $.each($('#docsBody').find('tr'), function(index, elem){
                $(this).removeClass('hide')
            })
        }else{
            $.each($('#docsBody').find('tr'), function(index, elem){
                var text = $(this).find('.showCursor').text()
                if(text.toLowerCase().search(search.toLowerCase()) < 0){
                    $(this).addClass('hide')
                }
            })
        }
    })
})