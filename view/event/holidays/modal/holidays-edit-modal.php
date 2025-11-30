<div class="modal fade" id="modal-edit-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">VER <span class="bolder">Evento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditEvent" name="formEditEvent">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="users" class="col-xs-3 control-label">Empleado</label>
                        <div class="col-xs-9">
                            <div class="input-group" id="usersSelect">
                                <input type="text" size="30" class="form-control" id="users" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="25" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha" disabled>
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
                                <input type="text" size="25" class="form-control datepicker" id="endDate" name="endDate" aria-describedby="fecha" disabled>
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
                                <input type="text"  size="30" class="form-control" id="status" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="deleteEvent" type="button" class="btn btn-danger"><i class="fa fa-floppy-o" aria-hidden="true"></i> Eliminar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>