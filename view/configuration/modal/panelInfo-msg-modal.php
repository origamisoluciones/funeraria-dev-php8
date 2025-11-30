<div class="modal fade" id="modal-message-panelinfo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Configurar <span class="bolder">Mensaje</span></h4>
            </div>
            <div class="modal-body">  
                <form class="form-horizontal" id="formMessage" name="formMessage">
                    <div class="form-group">
                        <div class="col-xs-offset-2 col-xs-10">
                            <span style="color:#0077B8; font-size:14px; margin-bottom:5px">Este mensaje se mostrará varias veces, 15 minutos antes de las salidas programadas.</span>
                            <br>
                            <label for="messageText">Mensaje</label>
                            <textarea class="form-control" id="messageText" cols="60" rows="10"></textarea>
                            <input type ="checkbox" id="showMessage"><label style="margin-left: 5px;" for="showMessage">Mostrar en panel</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                        <button type="button" id="saveMessage" class="btn btn-sm btn-primary">
                            <i class="fa fa-floppy-o" aria-hidden="true"></i> 
                            GUARDAR MENSAJE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-show-message-panelinfo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document" style="width: 1000px;">
        <div class="modal-content">            
            <div class="modal-body" style="height: 650px; display: table; margin-left: 160px">  
                <p id='showMessagePreview' style="font-size:36px; color:#002490; display: table-cell; vertical-align: middle;"></p>
            </div>
        </div>
    </div>
</div>