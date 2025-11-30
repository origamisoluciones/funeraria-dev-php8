<div class="modal fade" id="modal-new-poll-item" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Pregunta</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="question" class="col-xs-3 control-label">Título</label>
                        <div class="col-xs-9">
                            <input type="text" size="50" class="form-control" id="question" name="question" autocomplete="none">
                            <span class="inputError" id="questionError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="questionOrder" class="col-xs-3 control-label">Orden</label>
                        <div class="col-xs-6">
                            <input type="number" step="1" min="0" size="25" class="form-control" style="width:20%!important;" id="questionOrder" name="questionOrder" autocomplete="none">
                            <span class="inputError" id="questionOrderError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewPollItem" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-poll-item" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Pregunta</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="itemID" name="itemID" value="">
                    <div class="form-group">
                        <label for="question" class="col-xs-3 control-label">Título</label>
                        <div class="col-xs-9">
                            <input type="text" size="50" class="form-control" id="question" name="question" autocomplete="none">
                            <span class="inputError" id="questionError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="questionOrder" class="col-xs-3 control-label">Orden</label>
                        <div class="col-xs-6">
                            <input type="number" step="1" min="0" size="25" class="form-control" style="width:20%!important;" id="questionOrder" name="questionOrder" autocomplete="none">
                            <span class="inputError" id="questionOrderError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditPollItem" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>