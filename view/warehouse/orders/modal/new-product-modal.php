<div class="modal fade" id="modal-new-product" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Producto</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewProduct" name="formNewProduct">
                <div id="msg"></div>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Producto</span></legend>
                        <div class="form-group">
                            <label for="productName" class="col-xs-2 control-label">Producto</label>
                            <div class="col-xs-10">     
                                <input type="text" size="30" id="productName" name="productName" class="form-control">
                                <span class="inputError" id="productNameError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="productTypeID" class="col-xs-2 control-label">Tipo</label>
                            <div class="col-xs-10">     
                                <select id="productTypeID" name="productTypeID" class="form-control select2" disabled></select>
                                <span class="inputError" id="productTypeIDError"></span>
                            </div>
                        </div>
                        <div class="form-group hide">
                            <label for="productClassID" class="col-xs-2 control-label">Clase</label>
                            <div class="col-xs-10">     
                                <select id="productClassID" name="productClassID" class="form-control select2"></select>
                                <span class="inputError" id="productClassIDError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="IVATypeID" class="col-xs-2 control-label"><?= $ivaLabel ?></label>
                            <div class="col-xs-10">     
                                <select id="IVATypeID" name="IVATypeID" class="form-control select2"></select>
                                <span class="inputError" id="IVATypeIDError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-11">
                                    <label class="'checkbox-inline' hide">
                                        <input type="checkbox" id="press" name="press"> Prensa
                                    </label>
                                    <label class="'checkbox-inline'">
                                        <input type="checkbox" id="supplied" name="supplied"> Suplido
                                    </label>
                                    <label class="'checkbox-inline'">
                                        <input type="checkbox" id="isInvoiced" name="isInvoiced"> <span class="bolder">No facturable</span>
                                    </label>
                                    <label class="'checkbox-inline'">
                                        <input type="checkbox" id="amount" name="amount"> Cantidad
                                    </label>
                                    <label class="'checkbox-inline'">
                                        <input type="checkbox" id="texts" name="texts"> Texto
                                    </label>
                                    <label class="'checkbox-inline'">
                                        <input type="checkbox" id="preOrder" name="preOrder"> Genera pedido
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group hide">
                            <label for="IVATypeID" class="col-xs-4 control-label">Tipo de producto (pedidos)</label>
                            <div class="col-xs-8">     
                                <select name="orderType" id="orderType" disabled>
                                    <option value="1" selected>Producto libre</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewProduct" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>