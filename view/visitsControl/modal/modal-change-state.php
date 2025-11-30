<div class="modal fade" id="modal-change-state" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Cambiar <span class="bolder">Estado</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formData" name="formData">
                    <input type="hidden" id="incidentType" name="incidentType" value="">
                    <div class="form-group">                        
                        <label for="name" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">Estado</label>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <input type="hidden" id="visitControlID" name="visitControlID" value="">
                            <select class="form-control input-sm inline-block" id="state" name="state"></select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveState" name="saveState" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>