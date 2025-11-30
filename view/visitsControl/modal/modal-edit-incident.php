<div class="modal fade" id="incident-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Publicar <span class="bolder">Incidencia</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formData" name="formData">
                    <input type="hidden" id="incidentType" name="incidentType" value="">
                    <div class="form-group">                        
                        <label for="name" class="col-xs-3 control-label">Descripción</label>
                        <div class="col-xs-9">
                            <textarea rows="7" cols="60" class="form-control" id="incident" name="incident" value="incident" ></textarea>
                            <span class="inputError" id="incidentError"></span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveIncident" name="saveIncident" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>