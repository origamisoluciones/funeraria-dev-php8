<div class="modal fade" id="modal-edit-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Editar <span class="bolder">Evento </span> de  <span id="eventType" class="bolder"> </span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditEvent" name="formEditEvent">
                    <input type="hidden" id="eventID" name="eventID">
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="10" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha">
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
                                <input type="text" size="10" class="form-control datepicker" id="endDate" name="end" aria-describedby="fecha">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endDateError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="startTime" class="col-xs-3 control-label">Hora de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="10" class="form-control time" id="startTime" name="startTime">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="endTime" class="col-xs-3 control-label">Hora de fin</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="10" class="form-control time" id="endTime" name="endTime">
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
                                    <input id="allDay" name="allDay" class="minimal" type="checkbox" value="0">
                                    Todo el día
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Evento</label>
                        <div class="col-xs-9">
                            <textarea class="form-control" rows="3" cols="50" id="name" name="name"></textarea>
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
                                    <input id="reminder" name="reminder" class="minimal" type="checkbox" value="0">
                                    Recordatorio
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="status" class="col-xs-3 control-label">Estado</label>
                        <div class="col-xs-9">
                            <div class="input-group status">
                                <select class="form-control" id="status" name="status">
                                    <option value="1">Pendiente</option>
                                    <option value="2">Urgente</option>
                                    <option value="3">En proceso</option>
                                    <option value="4">Realizado</option>
                                </select>
                                <span class="input-group-addon"><i class="fa fa-circle" style="color: #0080FF;"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" id="reminderEmail">
                                    Recordatorio por correo
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hide" id="reminderEmailSection">
                        <div class="form-group">
                            <label for="reminderDate" class="col-xs-3 control-label">Fecha de aviso</label>
                            <div class="col-xs-9">
                                <div class="input-group date">
                                    <input type="text" size="10" class="form-control datepicker" id="reminderDate" name="reminderDate" aria-describedby="fecha">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="reminderDateError"></span>
                            </div>
                        </div>
                        <div class="form-group bootstrap-timepicker timepicker">
                            <label for="reminderTime" class="col-xs-3 control-label">Hora de aviso</label>
                            <div class="col-xs-9">
                                <div class="input-group">
                                    <input type="text" size="10" class="form-control time" id="reminderTime" name="reminderTime">
                                    <div class="input-group-addon">
                                        <i class="fa fa-clock-o"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="reminderTimeError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="reminderSendTo" class="col-xs-3 control-label">Con copia para</label>
                            <div class="col-xs-9">
                                <input type="email" size="30" class="form-control" id="reminderSendTo">
                                <span class="inputError" id="reminderSendToError"></span>
                            </div>
                        </div>
                        
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="deleteEvent" type="button" class="btn btn-danger"><i class="fa fa-trash" aria-hidden="true"></i> Eliminar</button>
                        <button id="saveEditEvent" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-show-anniversary" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Ver<span class="bolder"> Recordatorio de Esquela de Aniversario </span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <input type="hidden" id="recordatoryEventID" name="recordatoryEventID">
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="10" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha" disabled>
                            </div>
                            <span class="inputError" id="startDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endDate" class="col-xs-3 control-label">Fecha de fin</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="10" class="form-control datepicker" id="endDate" name="end" aria-describedby="fecha" disabled>
                            </div>
                            <span class="inputError" id="endDateError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="startTime" class="col-xs-3 control-label">Hora de inicio</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="10" class="form-control time" id="startTime" name="startTime" disabled>
                            </div>
                            <span class="inputError" id="startTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="endTime" class="col-xs-3 control-label">Hora de fin</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="10" class="form-control time" id="endTime" name="endTime" disabled>
                            </div>
                            <span class="inputError" id="endTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Evento</label>
                        <div class="col-xs-9">
                            <textarea class="form-control" rows="3" cols="50" id="name" name="name" disabled></textarea>
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="deleteEventRecordatory" type="button" class="btn btn-danger"><i class="fa fa-trash" aria-hidden="true"></i> Eliminar</button>
                        <button id="goExpedient" type="button" class="btn btn-primary"><i class="fa fa-eye" aria-hidden="true"></i> Ir al expediente</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>