<div class="modal fade" id="modal-itv" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="ITVTitle" class="modal-title"></h4>
            </div>
            <div class="modal-body">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">ITV</span></legend>
                    <input type="hidden" id="carID">
                    <div class="form-group">
                    <br>
                        <div class="row">
                            <div class="col-xs-6">
                                <label for="datePrevItv" class="col-xs-3 control-label"> Fecha ITV</label>
                                <div class="col-xs-6">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="datePrevItv" name="datePrevItv">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <label for="dateNextItv" class="col-xs-3 control-label">Próxima ITV</label>
                                <div class="col-xs-6">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="dateNextItv" name="dateNextItv">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-xs-6">
                                <label for="cost" class="col-xs-3 control-label">Importe</label>
                                <div class="col-xs-6">
                                    <input type="number" class="form-control" id="cost" name="cost">                                        
                                    <span class="inputError" id="costError"></span>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <label for="kms" class="col-xs-3 control-label">Kms</label>
                                <div class="col-xs-6">
                                    <input type="number" class="form-control" id="kms" name="kms">                                        
                                    <span class="inputError" id="kmsError"></span>
                                </div>
                            </div>
                            <label for="kms" class="label label-danger hide" id="kmsOverError">Los kilómetros a introducir deben ser mayores que los últimos introducidos</label>
                        </div>
                    </div>
                </fieldset>
                <div style="height: 600px; overflow-y: scroll;">
                    <table class="table table-striped table-responsive table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                        <thead>
                            <th class="hide">#</th>
                            <th class="centered">Fecha ITV</th>
                            <th class="centered">Próxima ITV</th>
                            <th class="centered">Importe</th>
                            <th class="centered">Kms</th>
                            <th></th>
                        </thead>
                        <tbody id="itvBody"></tbody>
                    </table>               
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveItv" name="saveItv" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                
            </div> 
        </div>
    </div>
</div>