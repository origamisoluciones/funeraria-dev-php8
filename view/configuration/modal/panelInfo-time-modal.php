<div class="modal fade" id="modal-times-panelInfo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Configuración <span class="bolder">Tiempos Slides</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                <div id="msg"></div>
                    <input type="text"  size="30" class="form-control hide" id="ID" name="ID" >
                    <div class="form-group">
                        <label for="timeUpSlide" class="col-xs-6 control-label">Slide Superior (segundos)</label>
                        <div class="col-xs-6">
                            <input type="number" min="1" size="30" class="form-control" id="timeUpSlide" name="timeUpSlide">
                            <span class="inputError" id="timeUpSlideError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="timeDownSlide" class="col-xs-6 control-label">Slide Inferior (segundos)</label>
                        <div class="col-xs-6">
                            <input type="number" min="1" size="30" class="form-control" id="timeDownSlide" name="timeDownSlide">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveTime" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>