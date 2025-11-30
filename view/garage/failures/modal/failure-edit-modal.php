<div class="modal fade" id="modal-edit-failure" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="failureTitle" class="modal-title"></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditFailure" name="formEditFailure">
                    <input type="hidden" id="vehicleID">
                    <input type="hidden" id="failureID">
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="failureDate" class="col-xs-4 control-label">Fecha avería</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="30" class="form-control datepicker" id="failureDate" name="failureDate">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="failureDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="repairDate" class="col-xs-4 control-label">Fecha reparación</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="30" class="form-control datepicker" id="repairDate" name="repairDate">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="repairDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="kms" class="col-xs-4 control-label">Kilómetros</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="kms" name="kms" class="form-control"/>
                                <span class="inputError" id="kmsError"></span>
                            </div>
                        </div>
                        
                        <div class="col-xs-12 hide" id="kmsOverError">
                            <label for="kms" class="label label-danger">Los kilómetros a introducir deben ser mayores que los últimos introducidos</label>
                            <br><br>
                        </div>
                        <div class="col-xs-6">
                            <label for="repairWarranty" class="col-xs-4 control-label">Garantía reparación</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="30" class="form-control datepicker" id="repairWarranty" name="repairWarranty">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="repairWarrantyError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="cost" class="col-xs-4 control-label">Importe</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="cost" name="cost" class="form-control" />
                                <span class="inputError" id="costError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="repairMaterial" class="col-xs-4 control-label">Garantía materiales</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="30" class="form-control datepicker" id="repairMaterial" name="repairMaterial">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="repairMaterialError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="receipt" class="col-xs-4 control-label">Factura</label>
                            <div class="col-xs-7">
                                <input type="text" min="0" id="receipt" name="receipt" class="form-control"/>
                                <span class="inputError" id="receiptError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="deliveryNote" class="col-xs-4 control-label">Albarán</label>
                            <div class="col-xs-7">
                                <input type="text" min="0" id="deliveryNote" name="deliveryNote" class="form-control"/>
                                <span class="inputError" id="deliveryNoteError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="garage" class="col-xs-4 control-label">Taller</label>
                            <div class="col-xs-7">
                                <select id="garage" name="garage" class="form-control"></select>
                                <span class="inputError" id="garageError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-12">
                            <label for="failureDescription" class="col-xs-2 control-label">Descripción de la avería</label>
                            <div class="col-xs-9">
                                <textarea class="form-control" name="failureDescription" id="failureDescription" rows="5" cols="108"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-12">
                            <label for="repairDescription" class="col-xs-2 control-label">Descripción de la reparación</label>
                            <div class="col-xs-9">
                                <textarea class="form-control" name="repairDescription" id="repairDescription" rows="5" cols="108"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-12">
                            <label for="usedMaterials" class="col-xs-2 control-label">Materiales empleados</label>
                            <div class="col-xs-9">
                                <textarea class="form-control" name="usedMaterials" id="usedMaterials" rows="5" cols="108"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditFailure" name="saveEditFailure" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>