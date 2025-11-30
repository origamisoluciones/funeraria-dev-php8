<div class="modal fade" id="modal-insurance" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Seguro del Coche</span></h4>
            </div>
            <div class="modal-body">              
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Pagos</span></legend>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="paymentDate" class="col-xs-5 control-label"> Fecha de último pago</label>
                                <div class="col-xs-7">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="paymentDate" name="paymentDate">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="amountInsurance" class="col-xs-5 control-label">Importe prima</label>
                                <div class="col-xs-7">
                                    <input type="number" min=0 class="form-control" id="amountInsurance" name="amountInsurance">                                        
                                    <span class="inputError" id="amountInsuranceError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="createDate" class="col-xs-5 control-label"> Fecha de alta</label>
                                <div class="col-xs-7">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="createDate" name="createDate">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="phone" class="col-xs-5 control-label">Teléfono de asistencia</label>
                                <div class="col-xs-7">
                                    <input type="text" class="form-control" id="phone" name="phone">                                        
                                    <span class="inputError" id="amountInsuranceError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="finalDate" class="col-xs-5 control-label"> Fecha de vencimiento</label>
                                <div class="col-xs-7">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="finalDate" name="finalDate">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>                                
                            </div>
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="insurancePolicy" class="col-xs-5 control-label">Nº poliza</label>
                                <div class="col-xs-7">
                                    <input type="text" min=0 class="form-control" id="insurancePolicy" name="insurancePolicy">                                        
                                    <span class="inputError" id="amountInsuranceError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-6">
                                <label for="company" class="col-xs-5 control-label">Compañía aseguradora</label>
                                <div class="col-xs-7">
                                    <input type="text" class="form-control" id="company" name="company">                                        
                                    <span class="inputError" id="amountInsuranceError"></span>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </fieldset>
                <div style="height: 500px; overflow-y: scroll;">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                            <thead>
                                <th class="hide">#</th>
                                <th>Último pago</th>
                                <th>Importe</th>
                                <th>Alta</th>
                                <th>Vencimiento</th>
                                <th>Nº póliza</th>
                                <th>Compañía</th>
                                <th>Teléfono Asistencia</th>
                                <th></th>
                            </thead>
                            <tbody id="insuranceBody"></tbody>
                        </table>               
                    </div>
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveInsurance" name="saveInsurance" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>