<div class="modal fade" id="modal-new-email-control" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Correo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDataControl" name="formNewDataControl">
                    <div class="form-group">
                        <label for="email" class="col-xs-3 control-label">Correo</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="email" name="email" autocomplete="none">
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewEmailControl" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-email-control" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Correo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataControl" name="formEditDataControl">
                    <input type="hidden" id="ID" name="ID" value="">
                    <div class="form-group">
                        <label for="email" class="col-xs-3 control-label">Correo</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="email" name="email" autocomplete="none">
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditEmailControl" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>