<div class="modal fade" id="showImgModal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ver <span class="bolder">imagen</span></h4>
            </div>
            <div class="modal-body text-center">
                <img class="img-responsive" src="" alt="imagen" id="imageShow">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addImageModal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Añadir <span class="bolder">imagen</span></h4>
            </div>
            <div class="alert alert-warning hide" id="addImageWarning">Debes seleccionar una imagen</div>
            <div class="alert alert-warning hide" id="addImageTypeWarning">Solamente se permiten subir imágenes con formato <strong>png</strong></div>
            <div class="modal-body">
                <label for="addImageInput">Imagen (png)</label>
                <input type="file" class="form-control" id="addImageInput" accept="image/png">
                <span id="tempImageName"></span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button id="goAddImage" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Subir</button>
            </div>
        </div>
    </div>
</div>