<div class="modal fade" id="modal-new-iva" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">impuesto<span id="ivaTypeName"></span></span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData">
                    <div class="form-group">
                        <label for="email" class="col-xs-3 control-label">Impuesto</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="iva" autocomplete="none">
                            <span class="inputError" id="ivaError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewIva" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>