<div class="modal fade" id="modal-new-model" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Modelo</span> del producto <span id="productName"></span> </h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewModel" name="formNewModel">
                    <input type="hidden" id="productID" name="productID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-4 control-label">Modelo</label>
                        <div class="col-xs-8">
                            <input type="text" size="20" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="purchasePrice" class="col-xs-4 control-label">Precio de compra</label>
                        <div class="col-xs-8">
                            <input type="number" size="4" min="0" class="form-control" id="purchasePrice" name="purchasePrice">
                            <span class="inputError" id="purchasePriceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplier" class="col-xs-4 control-label">Proveedor</label>
                        <div class="col-xs-8">
                            <select id="supplierModel" name="supplier" class="form-control"></select>
                            <span class="inputError" id="supplierError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="year" class="col-xs-4 control-label">Año</label>
                        <div class="col-xs-8">
                            <input type="number" size="4" min="0" class="form-control" id="year" name="year">
                            <span class="inputError" id="yearError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Imagen</label>
                        <div class="col-xs-8">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el modelo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Tarifas asociadas</span></legend>
                        <div class="prices"></div>
                    </fieldset>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewModel" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>