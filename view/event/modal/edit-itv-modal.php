<div class="modal fade" id="modal-editItv_Ins-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Evento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditItvEvent" name="formEditItvEvent">
                    <input type="hidden" id="eventID" name="eventID" value="">
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="15" class="form-control datepicker" id="startDate" name="startDate" disabled>
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Evento</label>
                        <div class="col-xs-9">
                            <input type="text" class="form-control" id="name" name="name" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="user" class="col-xs-3 control-label">Usuario</label>
                        <div class="col-xs-9">
                            <input type="text" class="form-control" id="user" name="user" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-4 col-xs-8">
                            <div class="checkbox">
                                <label>
                                    <input id="reminder" name="reminder" type="hidden" value="0">
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
                                    <option value="1" selected>Pendiente</option>
                                    <option value="4"> Realizado</option>
                                </select>
                                <span class="input-group-addon"><i class="fa fa-circle"></i></span>
                            </div>
                            <span class="inputError" id="statusError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditItv_InsEvent" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>