<div class="modal fade" id="modal-new-deliveryNoteLine" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Línea de Albarán</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDeliveryNoteLine" name="formNewDeliveryNoteLine">
                    <div class="form-group">
                        <label for="product" class="col-xs-3 control-label">Producto</label>
                        <div class="col-xs-9">
                            <select class="form-control" name="product" id="product"></select>
                            <span class="inputError" id="productError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="model" class="col-xs-3 control-label">Modelo</label>
                        <div class="col-xs-9">
                            <select class="form-control" name="model" id="model"></select>
                            <span class="inputError" id="modelError"></span>
                        </div>
                    </div>
                    <div class="form-group">    
                        <label for="amount" class="col-xs-3 control-label">Cantidad</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" name="amount" id="amount" class="form-control">
                            <span class="inputError" id="amountError"></span>
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewDeliveryNoteLine" name="saveNewDeliveryNoteLine" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>