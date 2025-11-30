<div class="modal fade" id="modal-new-task" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Tarea libre</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div id="msg"></div>
                    <div class="form-group">
                        <label for="startDate" class="col-xs-4 control-label">Fecha Inicio</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control change-new-time datepicker" id="startDate" name="startDate" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startDateError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="startTime" class="col-xs-4 control-label">Hora Inicio</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control change-new-time time" id="startTime" name="startTime" autocomplete="off">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endDate" class="col-xs-4 control-label">Fecha Fin</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control change-new-time datepicker" id="endDate" name="endDate" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endDateError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="endTime" class="col-xs-4 control-label">Hora Fin</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control change-new-time time" id="endTime" name="endTime" autocomplete="off">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endTimeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="staffDesignated" class="col-xs-4 control-label">Personal asignado</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <select id="staffDesignated" name="staffDesignated" class="form-control" disabled></select>
                            </div>
                            <span class="inputError" id="staffDesignatedError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mortuary" class="col-xs-4 control-label">Tanatorio</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <select id="mortuary" name="mortuary" class="form-control"></select>
                            </div>
                            <span class="inputError" id="mortuaryError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="status" class="col-xs-4 control-label">Estado</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <select id="status" name="status" class="form-control"></select>
                            </div>
                            <span class="inputError" id="statusError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-4 control-label">Descripción</label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="5" cols="37" id="description" name="description" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewTask" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-task" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Tarea libre</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <div class="form-group">
                        <label for="startDateEdit" class="col-xs-4 control-label">Fecha Inicio</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control change-edit-time datepicker" id="startDateEdit" name="startDateEdit" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startDateEditError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="startTimeEdit" class="col-xs-4 control-label">Hora Inicio</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control change-edit-time time" id="startTimeEdit" name="startTimeEdit" autocomplete="off">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startTimeEditError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endDateEdit" class="col-xs-4 control-label">Fecha Fin</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control change-edit-time datepicker" id="endDateEdit" name="endDateEdit" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endDateEditError"></span>
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="endTimeEdit" class="col-xs-4 control-label">Hora Fin</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control change-edit-time time" id="endTimeEdit" name="endTimeEdit" autocomplete="off">
                                <div class="input-group-addon">
                                    <i class="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <span class="inputError" id="endTimeEditError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="staffDesignatedEdit" class="col-xs-4 control-label">Personal asignado</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <select id="staffDesignatedEdit" name="staffDesignatedEdit" class="form-control"></select>
                            </div>
                            <span class="inputError" id="staffDesignatedEditError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mortuaryEdit" class="col-xs-4 control-label">Tanatorio</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <select id="mortuaryEdit" name="mortuaryEdit" class="form-control"></select>
                            </div>
                            <span class="inputError" id="mortuaryEditError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="statusEdit" class="col-xs-4 control-label">Estado</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <select id="statusEdit" name="statusEdit" class="form-control"></select>
                            </div>
                            <span class="inputError" id="statusEditError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-4 control-label">Descripción</label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="5" cols="37" id="description" name="description" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditTask" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>