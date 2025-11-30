<div class="modal fade" id="modal-new-gravedigger" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Enterrador</span></h4>
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
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail">
                            <span class="inputError" id="mailError"></span>
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
                            <span class="inputError" id="mobilePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone" autocomplete="none">
                            <span class="inputError" id="otherPhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Cementerios</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <select id="cemetery" name="cemetery" class="form-control cemetery"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-cemetery" title="Añadir cementerio">
                                        <i class="fa fa-arrow-circle-down"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="cemeteries"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewGravedigger" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-gravedigger" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Enterrador</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                <div id="msg"></div>
                    <input type="hidden" id="gravediggerID" name="gravediggerID" value="">
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
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail">
                            <span class="inputError" id="mailError"></span>
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
                            <span class="inputError" id="mobilePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone" autocomplete="none">
                            <span class="inputError" id="otherPhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Cementerios</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <select id="cemetery" name="cemetery" class="form-control cemetery"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-cemetery" title="Añadir cementerio">
                                        <i class="fa fa-arrow-circle-down"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="cemeteries"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditGravedigger" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>