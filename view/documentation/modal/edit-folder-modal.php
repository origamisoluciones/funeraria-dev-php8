<div class="modal fade" id="modal-edit-folder" role="dialog" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Modificar carpeta</span></h4>
            </div>
            <div class="modal-body">                             
                <div class="form-group">
                    <div class="col-xs-12">
                        <label for="folder">Nombre de la carpeta</label>
                        <input type="text" class="form-control" id="folder">
                        <span class="label label-warning">Se permiten los siguientes caracteres: alfanuméricos, guión bajo y guión medio</span>
                        <span class="label label-danger hide" id="folderError">El nombre tiene un formato incorrecto</span>
                        <span class="label label-danger hide" id="folderNameError">Ya existe una carpeta con ese nombre</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="saveEditFolder" class="btn btn-sm btn-primary"><i class="fa fa-cloud-upload" aria-hidden="true"></i> MODIFICAR CARPETA</button>       
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                         
            </div> 
        </div>
    </div>
</div>