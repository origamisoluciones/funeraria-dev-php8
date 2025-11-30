<div class="modal fade" id="modal-edit-template" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Plantilla</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData" action="" method="post">
                    <input type="hidden" id="templateID" name="templateID" value="">
                    <input type="hidden" id="productID" name="productID" value="">
                    <input type="hidden" id="retailID" name="retailID" value="">
                    <input type="hidden" id="modelID" name="modelID" value="">
                    <input type="hidden" id="check" name="check" value="">
                    
                    <div class="form-group">
                        <label for="product" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Producto</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="product" name="product" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="amount" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Cantidad</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="amount" name="amount" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="texts" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Textos</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <textarea class="form-control" rows="3" id="texts" name="texts" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div class="form-group supplier-group">
                        <label for="supplier" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Proveedor</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="supplier" name="supplier" class="form-control"></select>
                        </div>
                    </div>
                    <div class="form-group model-group">
                        <label for="model" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Modelo</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="model" name="model" class="form-control"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="retail" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Precio</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" min="0" class="form-control" id="retail" name="retail" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="discount" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">% Dto.</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" min="0" class="form-control" id="discount" name="discount" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="total" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Total</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" min="0" class="form-control" id="total" name="total" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="saveEditData"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>