<div class="modal fade" id="modal-new-bellringer" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Campanero</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                <div id="msg"></div>
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
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                            <span class="inputError" id="addressError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="area" class="col-xs-3 control-label">Zona</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="area" name="area" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="parish" class="col-xs-3 control-label">Parroquia</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="parish" name="parish" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email" class="col-xs-3 control-label">Email</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="email" name="email" autocomplete="none">
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="homePhone" class="col-xs-3 control-label">Telf. Fijo</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone" autocomplete="none">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mobilePhone" class="col-xs-3 control-label">Telf. Móvil</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Iglesias</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <select id="church" name="church" class="form-control church"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-church" title="Añadir iglesia">
                                        <i class="fa fa-plus"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="churches"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewBellringer" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-bellringer" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Campanero</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <input type="hidden" id="bellringerID" name="bellringerID" value="">
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
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                            <span class="inputError" id="addressError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="area" class="col-xs-3 control-label">Zona</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="area" name="area" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="parish" class="col-xs-3 control-label">Parroquia</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="parish" name="parish" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email" class="col-xs-3 control-label">Email</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="email" name="email" autocomplete="none">
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="homePhone" class="col-xs-3 control-label">Telf. Fijo</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone" autocomplete="none">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mobilePhone" class="col-xs-3 control-label">Telf. Móvil</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Iglesias</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <select id="church" name="church" class="form-control church"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-church" title="Añadir iglesia">
                                        <i class="fa fa-plus"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="churches"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditBellringer" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>