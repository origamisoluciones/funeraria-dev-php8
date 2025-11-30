<div class="modal fade" id="modal-edit-event" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Mantenimiento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="eventID" name="eventID" value="">
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="startDate" name="startDate">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="starDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endDate" class="col-xs-3 control-label">Fecha de fin</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="endDate" name="endDate">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="startTime" class="col-xs-3 control-label">Hora de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group bootstrap-timepicker timepicker">
                                <input type="text" size="30" class="form-control time" id="startTime" name="startTime">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endTime" class="col-xs-3 control-label">Hora de fin</label>
                        <div class="col-xs-9">
                            <div class="input-group bootstrap-timepicker timepicker">
                                <input type="text" size="30" class="form-control time" id="endTime" name="endTime">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input id="allDay" name="allDay" type="hidden" value="0">
                                    <input id="allDay" name="allDay" class="minimal" type="checkbox" value="0">
                                    Todo el día
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="regularity" class="col-xs-3 control-label">Periodicidad</label>
                        <div class="col-xs-9">
                            <select id="regularity" name="regularity" class="form-control">
                                <option value="0">--</option>
                                <option value="1">Semanal</option>
                                <option value="2">Quincenal</option>
                                <option value="3">Mensual</option>
                                <option value="4">Bimensual</option>
                                <option value="5">Trimestral</option>
                                <option value="6">Cuatrimestral</option>
                                <option value="7">Semestral</option>
                                <option value="8">Anual</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cleaningType" class="col-xs-3 control-label">Tipo de mantenimiento</label>
                        <div class="col-xs-9">
                            <select id="cleaningType" name="cleaningType" class="form-control cleaningType"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cleaningMortuary" class="col-xs-3 control-label">Tanatorio</label>
                        <div class="col-xs-9">
                            <select id="cleaningMortuary" name="cleaningMortuary" class="form-control cleaningMortuary"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cleaningUser" class="col-xs-3 control-label">Personal</label>
                        <div class="col-xs-9">
                            <select id="cleaningUser" name="cleaningUser" class="form-control cleaningUser"></select>
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Evento</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="user" class="col-xs-3 control-label">Usuario</label>
                        <div class="col-xs-9">
                            <input type="text" class="form-control" id="user" name="user" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input id="reminder" name="reminder" type="hidden" value="0">
                                    <input id="reminder" name="reminder" class="minimal" type="checkbox" value="0">
                                    Aviso
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-3 control-label">Descripción</label>
                        <div class="col-xs-9">
                            <textarea rows="4" cols="40" class="form-control" id="description" name="description"></textarea>
                            <span class="inputError" id="descriptionError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="closeDoneEvent" type="button" class="btn btn-warning"><i class="fa fa-check-circle" aria-hidden="true"></i> Realizar y finalizar</button>
                        <button id="closeEvent" type="button" class="btn btn-success"><i class="fa fa-check-circle" aria-hidden="true"></i> Realizado</button>
                        <button id="deleteEvent" type="button" class="btn btn-danger"><i class="fa fa-trash" aria-hidden="true"></i> Eliminar</button>
                        <button id="saveEditEvent" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>