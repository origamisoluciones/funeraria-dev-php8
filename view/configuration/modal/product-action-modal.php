<div class="modal fade" id="modal-new-action" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Acción</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewAction" name="formNewAction">
                    <div class="form-group">
                        <label for="type" class="col-xs-3 control-label">Tipo</label>
                        <div class="col-xs-9">     
                            <select id="type" name="type" class="form-control select2">
                                <option value="text">Campo de texto</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="staff">Personal</option>
                            </select>
                            <span class="inputError" id="typeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="label" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">     
                            <input type="text" size="20" id="label" name="label" class="form-control" autocomplete="none">
                            <span class="inputError" id="labelError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="orderBySection">
                        <label for="orderBy" class="col-xs-3 control-label">Orden</label>
                        <div class="col-xs-9">     
                            <input type="number" size="4" id="orderBy" name="orderBy" class="form-control" autocomplete="none">
                            <span class="inputError" id="orderByError"></span>
                        </div>
                    </div>
                    <div class="form-group hide" id="postStaffSection">                        
                        <div class="col-xs-12" id="postStaff">                                                     
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewAction" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-action" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Acción</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditAction" name="formEditAction">
                    <input type="hidden" id="ID" name="ID" value="">
                    <div class="form-group hide" id="typeSection">
                        <label for="type" class="col-xs-3 control-label">Tipo</label>
                        <div class="col-xs-9">     
                            <select id="type" name="type" class="form-control select2">
                                <option value="text">Campo de texto</option>
                                <option value="checkbox">Checkbox</option> 
                                <option value="staff">Personal</option>                               
                            </select>
                            <span class="inputError" id="typeError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="nameSection">
                        <label for="label" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">     
                            <input type="text" size="20" id="label" name="label" class="form-control" autocomplete="none">
                            <span class="inputError" id="labelError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="orderBySection">
                        <label for="orderBy" class="col-xs-3 control-label">Orden</label>
                        <div class="col-xs-9">     
                            <input type="number" size="4" id="orderBy" name="orderBy" class="form-control" autocomplete="none">
                            <span class="inputError" id="orderByError"></span>
                        </div>
                    </div>
                    <div class="form-group hide" id="postStaffSectionEdit">                        
                        <div class="col-xs-12" id="postStaffEdit">                                                     
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditAction" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>