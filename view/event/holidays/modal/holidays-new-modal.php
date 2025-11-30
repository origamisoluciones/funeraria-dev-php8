<div class="modal fade" id="modal-new-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Evento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewEvent" name="formNewEvent">
                <div id="msg"></div>
                    <div class="form-group">
                        <label for="users" class="col-xs-3 control-label">Empleado</label>
                        <div class="col-xs-9">
                            <div class="input-group" id="usersSelect">
                                <select class="form-control" id="users" name="users"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="25" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endDate" class="col-xs-3 control-label">Fecha de fin</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="25" class="form-control datepicker" id="endDate" name="endDate" aria-describedby="fecha">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="status" class="col-xs-3 control-label">Tipo</label>
                        <div class="col-xs-9">
                            <div class="input-group status">
                                <select class="form-control" id="status" name="status">
                                    <option value="8" selected>Vacaciones</option>
                                    <option value="9">Personal</option>
                                    <option value="10">Enfermedad</option>
                                    <option value="11">Médico</option>
                                    <option value="12">Cumpleaños</option>
                                </select>
                                <span class="input-group-addon"><i class="fa fa-circle" style="color: #088A08;"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewEvent" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>