<div class="modal fade" id="modal-info-date-vehicles" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Info vehículo</h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="plate" name="plate" value="">
                <div class="row">
                    <div class="col-xs-6">
                        <label for="startDate" class="control-label">Fecha de inicio</label>
                        <div class="input-group date">
                            <input type="text" size="12" class="form-control datepicker" id="startDate" name="startDate">
                            <div class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                            </div>
                        </div>
                        <span class="inputError" id="startDateError"></span>
                    </div>
                    <div class="col-xs-6">
                        <label for="endDate" class="control-label">Fecha de fin</label>
                        <div class="input-group date">
                            <input type="text" size="12" class="form-control datepicker" id="endDate" name="endDate">
                            <div class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                            </div>
                        </div>
                        <span class="inputError" id="endDateError"></span>
                    </div>
                    <div class="row hide" id="dateError">
                        <div class="col-xs-12">
                            <span class="label label-danger">La fecha de inicio tiene que ser menor que la fecha de fin</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="goInfo" name="goInfo" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Ir</button>
            </div> 
        </div>
    </div>
</div>