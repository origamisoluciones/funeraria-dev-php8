<div class="modal fade" id="modal-options-panelinfo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Configurar <span class="bolder">opciones</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formOptions" name="formOptions">
                    <div class="form-group">
                        <label for="repeat" class="col-xs-5 control-label">
                            <span class="bge-blue-light"  title="Los mensajes se repiten cada X minutos antes de la salida del difunto de la sala.">Tiempo del mensaje</span>
                        </label>
                        <div class="col-xs-7">
                            <div class="input-group">
                                <input type="text" size="5" class="form-control" id="repeat" name="repeat">
                                <div class="input-group-addon">MIN.</div>
                            </div>
                            <span class="inputError" id="repeatError"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveOptions" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>