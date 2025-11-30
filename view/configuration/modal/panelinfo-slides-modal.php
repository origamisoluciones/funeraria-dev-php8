<div class="modal fade" id="modal-slides-panelinfo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Configurar <span class="bolder">Slider Superior</span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <div id="currentSlider" style="display: block; overflow-x: scroll;"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <div class="form-group">
                            <input type="file" class="form-control" id="fileSlideUp">
                            <span class="label label-warning hide" id="emptyError">Selecciona un archivo para subir</span>
                            <span class="label label-danger hide" id="formatError">Tipo de archivo no permitido (jpg, jpge o png)</span>
                            <span class="label label-danger hide" id="error">Se ha producido un error al subir la imagen</span>
                            <span class="label label-success hide" id="success">Se ha subido la imagen correctamente</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button type="button" id="upload" class="btn btn-sm btn-primary">
                    <i class="fa fa-picture-o" aria-hidden="true"></i> 
                    AÑADIR FOTO A SLIDE
                </button>
            </div>
        </div>
    </div>
</div>