<div class="modal fade" id="modal-new-vehicle" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Vehículo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewVehicle" name="formNewVehicle">
                    <div class="form-group">
                        <label for="licensePlate" class="col-xs-3 control-label">Matrícula</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="licensePlate" name="licensePlate" class="form-control" />
                            <span class="inputError" id="licensePlateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="imei" class="col-xs-3 control-label">IMEI</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="imei" name="imei" class="form-control" />
                            <span class="inputError" id="imeiError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="brand" class="col-xs-3 control-label">Marca</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="brand" name="brand" class="form-control" />
                            <span class="inputError" id="brandError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="model" class="col-xs-3 control-label">Modelo</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="model" name="model" class="form-control" />
                            <span class="inputError" id="modelError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="kms" class="col-xs-3 control-label">Kilómetros</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="kms" name="kms" class="form-control" />
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="maintenance" class="col-xs-3 control-label">Mantenimiento</label>
                        <div class="col-xs-9">
                            <input type="checkbox" id="maintenance" name="maintenance" />
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="chassis" class="col-xs-3 control-label">Chasis</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="chassis" name="chassis" class="form-control" />
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-xs-3 control-label">Uso</label>
                        <div class="col-xs-9">
                            <select id="type" class="form-control">
                                <option value="0">--</option>
                                <option value="1">Iglesia</option>
                                <option value="2">Incineración</option>
                                <option value="3">Familia</option>
                                <option value="4">Fúnebre</option>
                                <option value="5">Furgoneta</option>
                            </select>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="external" class="col-xs-3 control-label">Subcontratado</label>
                        <div class="col-xs-9">
                            <input type="checkbox" id="external" name="external">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="showService" class="col-xs-3 control-label">Mostrar en C. Servicio y Expediente</label>
                        <div class="col-xs-9">
                            <input type="checkbox" id="showService" name="showService" style="margin-top: 13px;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="showService" class="col-xs-3 control-label">Vehículo Fúnebre</label>
                        <div class="col-xs-9">
                            <input type="checkbox" id="drivingService" name="drivingService">
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewVehicle" name="saveNewVehicle" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>