<div class="modal fade" id="modal-new-gasoil" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Gasoil</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewGasoil" name="formNewGasoil">
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
                                <input type="text" size="25" class="form-control datepicker" id="date" name="date" autocomplete="off">
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
                            <input type="number" min="0" step="0.5" size="10" id="litres" name="litres" class="form-control">
                            <span class="inputError" id="litresError"></span>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="priceLitre" class="col-xs-3 control-label">Precio/Litro</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" step="0.5" size="30" id="priceLitre" name="priceLitre" class="form-control">
                            <span class="inputError" id="priceLitreError"></span>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="net" class="col-xs-3 control-label">Base Imponible</label>
                        <div class="col-xs-9">
                            <input type="text" size="10" id="net" name="net" class="form-control" readonly>
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
                            <input type="text" size="10" id="total" name="total" class="form-control" readonly>
                            <span class="inputError" id=totalError"></span>
                        </div>                
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewGasoil" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>