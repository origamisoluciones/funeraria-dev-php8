<div class="modal fade" id="modal-panelInfo-footer" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Configuración <span class="bolder"> Slide Inferior</span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-6">
                        <div class="alert alert-info">Aviso: si selecciona otro slide sin guardar, se perderán los cambios.</div>
                    </div>
                    <div class="col-xs-6">
                        <button id="addSlide" type="button" class="btn btn-primary "><i class="fa fa-plus" aria-hidden="true"></i> Añadir Slide</button>
                        <button id="removeSlide" type="button" class="btn btn-danger "><i class="fa fa-minus" aria-hidden="true"></i> Eliminar Slide</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <div class="form-group">
                            <select id="slidesSelect">
                                <option selected disabled hidden>Selecciona un slide</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row hide" id="slideInfo">
                    <div class="col-xs-6">
                        <label>Imagen</label>
                        <div id="slideImg"></div>
                        <input type="file" class="form-control" id="uploadImg">
                    </div>
                    <div class="col-xs-6">
                        <label for="slideTitle">Texto</label>
                        <input type="text" class="form-control" id="slideTitle" autocomplete="none">
                        <br>
                        <textarea class="form-control" id="slideText" rows="10" cols="65" style="word-break: break-all;"></textarea>
                    </div>
                </div>
                <div id="message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button id="saveFooter" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar slide actual</button>
            </div>
        </div>
    </div>
</div>