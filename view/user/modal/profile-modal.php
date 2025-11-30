<div class="modal fade" id="modal-edit-profile" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Perfil</span></h4>
            </div>
            <div id="block-message-modal"></div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="userID" name="userID">
                    <div class="form-group">
                        <label for="username" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Nombre de Usuario</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" class="form-control" id="username" name="username" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Contraseña</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="password" class="form-control" id="password" name="password">
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label for="name" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" class="form-control" id="name" name="name" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Apellidos</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" class="form-control" id="surname" name="surname" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">NIF</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" class="form-control autocompleteNif" id="nif" name="nif" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Dirección</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" class="form-control" id="address" name="address" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <select id="province" name="province" class="form-control province" disabled></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <select id="location" name="location" class="form-control location" disabled></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">E-mail</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="email" class="form-control" id="mail" name="mail" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Teléfonos</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <div class="input-group">
                                <input type="text" class="form-control phone" id="phone" name="phone" disabled>
                                <span class="inputError" id="phoneError"></span>
                            </div>
                            <div class="phones"></div>
                        </div>
                    </div>
                    <div class="form-group hide">
                        <label for="type" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Tipo</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <select id="type" name="type" class="form-control select2" disabled>
                                <option value="1">Administrador</option>
                                <option value="2">Administrativo</option>
                                <option value="3">Asistencia</option>
                                <option value="4">Encargado</option>
                                <option value="5">Funerario</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="post" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Puesto</label>
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" class="form-control" id="post" name="post" disabled>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditProfile" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>