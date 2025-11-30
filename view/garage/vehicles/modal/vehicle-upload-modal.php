<div class="modal fade" id="modal-upload-doc" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Adjuntar <span class="bolder vehicle">documentación</span> del vehículo <span id="licenseDoc"class="bolder vehicle"></span></h4>
            </div>
            <div id="block-modal-messages"></div>
            <div class="modal-body">
                <div class="form-group">
                    <div class="col-xs-6">
                        <input type="file" class="form-control" name="fileAttachDoc[]" id="fileAttachDoc" multiple>
                    </div>
                    <div class="col-xs-6">
                        <button type="button" id="uploadFile" class="btn btn-sm btn-primary">
                            <i class="fa fa-cloud-upload" aria-hidden="true"></i> 
                            AÑADIR DOCUMENTACIÓN
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div> 
        </div>
    </div>
</div>