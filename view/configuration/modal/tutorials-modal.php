<div class="modal fade" id="modal-new-tutorial" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">tutorial</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="title" class="col-xs-2 control-label">Título</label>
                        <div class="col-xs-9">
                            <input type="text" size="60" class="form-control" id="title" name="title" autocomplete="none">
                            <span class="inputError" id="titleError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="status" class="col-xs-2 control-label">Estado</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="status" name="status"></select>
                            <span class="inputError" id="statusError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="link" class="col-xs-2 control-label">Link</label>
                        <div class="col-xs-9">
                            <input type="text" size="60" class="form-control" id="link" name="link" autocomplete="none">
                            <span class="inputError" id="linkError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewTutorial" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-tutorial" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">tutorial</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="title" class="col-xs-2 control-label">Título</label>
                        <div class="col-xs-9">
                            <input type="text" size="60" class="form-control" id="title" name="title" autocomplete="none">
                            <span class="inputError" id="titleError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="statusEdit" class="col-xs-2 control-label">Estado</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="statusEdit" name="statusEdit"></select>
                            <span class="inputError" id="statusEditError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="link" class="col-xs-2 control-label">Link</label>
                        <div class="col-xs-9">
                            <input type="text" size="60" class="form-control" id="link" name="link" autocomplete="none">
                            <span class="inputError" id="linkError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditTutorial" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>