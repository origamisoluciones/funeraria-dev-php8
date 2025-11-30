<div class="modal fade" id="modal-new-assistant" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Asistente</span></h4>
            </div>
            <div class="modal-body">
                <div id="warning-message"></div>
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname" autocomplete="none">
                            <span class="inputError" id="surnameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone" class="col-xs-3 control-label">Teléfono</label>
                        <div class="col-xs-9">
                        <input type="text" size="30" class="form-control" id="phone" name="phone" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">Email</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="isYourOwn" name="isYourOwn"> Propio
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="clientDiv" class="form-group">
                        <label for="client" class="col-xs-3 control-label">Cliente</label>
                        <div class="col-xs-9">
                            <select id="client" name="client" class="form-control select2 client"></select>
                            <span class="inputError" id="clientError"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewAssistant" name="saveNewAssistant" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-assistant" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Asistente</span></h4>
            </div>
            <div class="modal-body">
                <div id="warning-message"></div>
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" size="30" class="form-control" id="assistantID" name="assistantID">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname" autocomplete="none">
                            <span class="inputError" id="surnameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone" class="col-xs-3 control-label">Teléfono</label>
                        <div class="col-xs-9">
                        <input type="text" size="30" class="form-control" id="phone" name="phone" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">Email</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="isYourOwn" name="isYourOwn"> Propio
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="clientEditDiv" class="form-group">
                        <label for="client" class="col-xs-3 control-label">Cliente</label>
                        <div class="col-xs-9">
                            <select id="clientEdit" name="clientEdit" class="form-control select2"></select>
                            <span class="inputError" id="clientEditError"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditAssistant" name="saveEditAssistant" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>