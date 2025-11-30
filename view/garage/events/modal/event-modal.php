<div class="modal fade" id="modal-edit-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ver <span class="bolder">Evento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="eventID" name="eventID" value="">
                    
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Evento</label>
                        <div class="col-xs-9">
                            <input type="text" size="60" class="form-control" id="name" name="name" disabled>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="startDate" class="col-xs-3 control-label">Fecha</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="startDate" name="startDate" disabled>
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="startDateError"></span>
                        </div>
                    </div>

                    
                    <div class="form-group">
                        <label for="user" class="col-xs-3 control-label">Usuario</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="user" name="user" disabled>
                        </div>
                    </div>
                    <div class="form-group hide">
                        <div class="col-xs-offset-3 col-xs-8">
                            <div class="checkbox">
                                <label>
                                    <input id="reminder" name="reminder" type="hidden" value="0" >
                                    <input id="reminder" name="reminder" class="minimal" type="checkbox" value="0" disabled>
                                    <span>Recordatorio</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="status" class="col-xs-3 control-label">Estado</label>
                        <div class="col-xs-9">
                            <div class="input-group status">
                                <select class="form-control" id="status" name="status">
                                    <option label="Pendiente" value="1" selected>#0080FF</option>
                                    <option label="Realizado" value="4">#088A08</option>
                                </select>
                                <span class="input-group-addon"><i class="fa fa-circle"></i></span>
                            </div>
                            <span class="inputError" id="statusError"></span>
                        </div>
                    </div>
                    <div id="divCost" class="form-group hide">
                        <label for="cost" class="col-xs-3 control-label">Importe</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="cost" name="cost" disabled>
                        </div>
                    </div>
                    <input type="hidden" id="upkeepsID">
                    <input type="hidden" id="vehicleID">
                    <div id="upkeepsDiv" class="hide">
                        <fieldset>
                            <legend><span class="label label-primary labelLgExp">Mantenimientos</span></legend>
                            <div class="clearfix table-responsive">
                                <table class="table table-striped table-bordered display" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th class="centered">#</th>
                                            <th>Tarea</th>          
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody"></tbody>
                                </table>
                            </div>
                        </fieldset>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                        <button id="saveEditEvent" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>