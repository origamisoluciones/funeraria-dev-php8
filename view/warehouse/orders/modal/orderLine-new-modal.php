<div class="modal fade" id="modal-new-orderLine" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Línea de Pedido</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewOrderLine" name="formNewOrderLine">
                    <div class="form-group">
                        <label for="product" class="col-xs-4 control-label">Producto</label>
                        <div class="col-xs-8">
                            <select class="form-control" id="product"></select>
                            <span class="inputError" id="productError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="model" class="col-xs-4 control-label">Modelo</label>
                        <div class="col-xs-8">
                            <select class="form-control" id="model"></select>
                            <span class="inputError" id="modelError"></span>
                        </div>
                    </div>
                    <input type="hidden" id="supplierReference">
                    <div class="form-group">    
                        <label for="amount" class="col-xs-4 control-label">Cantidad</label>
                        <div class="col-xs-8">
                            <input type="number" min="1" id="amount">
                            <span class="inputError" id="amountError"></span>
                        </div>
                    </div>
                    <div class="form-group"> 
                        <label for="lastAmount" class="col-xs-4 control-label">Última cantidad pedida</label>
                        <div class="col-xs-8">
                            <input type="number" id="lastAmount" disabled>
                        </div>
                    </div>
                    <div class="form-group">    
                        <label for="price" class="col-xs-4 control-label">Precio</label>
                        <div class="col-xs-8">
                            <input type="number" min="1" id="price">
                            <span class="inputError" id="priceError"></span>
                        </div>
                    </div>
                    <div class="form-group"> 
                        <label for="lastPrice" class="col-xs-4 control-label">Último precio pedido</label>
                        <div class="col-xs-8">
                            <input type="number" id="lastPrice" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-8">
                            <label class="control-label">Fecha de última compra: <span id="lastPurchaseDate"></span></label>
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewOrderLine" name="saveNewOrderLine" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-orderLine-gasoil" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Línea de Pedido</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditGasoil" name="formEditGasoil">
                <input type="hidden" size="25" class="form-control" id="gasoilID" name="gasoilID">
                    <div class="form-group">
                        <label for="supplier" class="col-xs-3 control-label">Proveedor</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="supplier" name="supplier"></select>
                            <br><span class="inputError" id="supplierError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date" class="col-xs-3 control-label">Fecha</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="25" class="form-control datepicker" id="date" name="date">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="litres" class="col-xs-3 control-label">Litros</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" step="0.5" size="10" id="litres" name="litres" class="form-control" />
                            <span class="inputError" id="litresError"></span>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="priceLitre" class="col-xs-3 control-label">Precio/Litro</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" step="0.5" size="30" id="priceLitre" name="priceLitre" class="form-control" />
                            <span class="inputError" id="priceLitreError"></span>
                        </div>                
                    </div>
                    
                    <div class="form-group">
                        <label for="net" class="col-xs-3 control-label">Base Imponible</label>
                        <div class="col-xs-9">
                            <input type="text" size="10" id="net" name="net" class="form-control" readonly/>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="iva" class="col-xs-3 control-label"><?= $ivaLabel ?></label>
                        <div class="col-xs-9">
                        <select class="form-control select2" id="iva" name="iva"></select>
                        <span class="inputError" id="ivaError"></span>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="total" class="col-xs-3 control-label">Total</label>
                        <div class="col-xs-9">
                            <input type="text" size="10" id="total" name="total" class="form-control" readonly/>
                            <span class="inputError" id="totalError"></span>
                        </div>                
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewOrderLine" name="saveNewOrderLine" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>