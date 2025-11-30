<div class="modal fade" id="supplier-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Descripción <span class="bolder">pedido</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formOptions" name="formOptions">
                    <div class="form-group">
                        <label for="notes" class="col-xs-3 control-label">Descipción</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <textarea id="notes" rows="4" cols="180" name="notes"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveOptions" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>