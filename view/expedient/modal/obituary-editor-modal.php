<div class="modal fade" id="modal-upload-file" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Subir o seleccionar <strong>Imagen</strong></h4>
            </div>
            <div class="modal-body">
                <h4 for="image"><strong>Sube una imagen:</strong></h4>
                <div style="display:flex; justify-content:init; align-items:center; margin-bottom:15px">
                    <input type="file" id="image">
                    <span class="badge badge-danger hide" id="emptyError">Debes seleccionar una imagen</span>
                    <span class="badge badge-danger hide" id="formatError">Formato de archivo no permitido (jpg, jpeg, png o gif)</span>
            
                    <button id="uploadImage" type="button" class="btn btn-primary" style="margin-top: 4px; margin-left:6px"><i class="fa fa-floppy-o" aria-hidden="true"></i> Subir imagen</button>
                </div>
                <hr style="margin-bottom:15px">
                <div id="loadingAddImage" class="hide" >Cargando...</div>
                <h4 id="selectAddImageText" class="hide"><strong>Selecciona una imagen:</strong></h4>
                <div class="row hide" id="imagesSources"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="chooseImage" disabled> Añadir imagen seleccionada</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-preview" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Vista preliminar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <div id="showPreview"></div>
                <div class="overlay"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade modalDownload" id="modal-download" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Guardar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <p>La esquela se está guardando. En breves se descargará el pdf con el resultado</p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-help" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Guardar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <p><strong>Ctrl + z</strong> : Deshacer</p>
                <p><strong>Ctrl + y</strong> : Rehacer</p>
                <hr>
                <h4><strong>Con un elemento seleccionado</strong></h4>
                <p><strong>Supr</strong> : Eliminar elemento</p>
                <p><strong>Ctrl + q</strong> : Adelante</p>
                <p><strong>Ctrl + m</strong> : Atrás</p>
                <p><strong>Flecha arriba</strong> : Mover hacia arriba (5pt)</p>
                <p><strong>Flecha abajo</strong> : Mover hacia abajo (5pt)</p>
                <p><strong>Flecha izquierda</strong> : Mover hacia la izquierda (5pt)</p>
                <p><strong>Flecha derecha</strong> : Mover hacia la derecha (5pt)</p>
                <p><strong>Shift + flecha arriba</strong> : Mover hacia arriba (10pt)</p>
                <p><strong>Shift + flecha abajo</strong> : Mover hacia abajo (10pt)</p>
                <p><strong>Shift + flecha izquierda</strong> : Mover hacia la izquierda (10pt)</p>
                <p><strong>Shift + flecha derecha</strong> : Mover hacia la derecha (10pt)</p>
                <p><strong>Ctrl + b</strong> : Negrita</p>
                <p><strong>Ctrl + k</strong> : Cursiva</p>
                <p><strong>Ctrl + u</strong> : Subrayado</p>
                <p><strong>Ctrl + l</strong> : Tachado</p>
                <p><strong>Ctrl + a</strong> : Alinear a la izquierda</p>
                <p><strong>Ctrl + s</strong> : Centrar</p>
                <p><strong>Ctrl + d</strong> : Alinear a la derecha</p>
                <p><strong>Ctrl + f</strong> : Justificar</p>
                <p><strong>Alt + (0 + 1 + 3 + 4) </strong> : Insertar cruz</p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-vivo-recuerdo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder">Vivo Recuerdo</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <p>Actualmente el expediente no se encuentra en Vivo Recuerdo.</p>
            </div>
        </div>
    </div>
</div>