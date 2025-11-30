<div class="modal fade" id="modal-new-priest" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Cura</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                <div id="msg"></div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address">
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
                            <input type="text" size="30" class="form-control" id="area" name="area">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="parish" class="col-xs-3 control-label">Parroquia</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="parish" name="parish">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="homePhone" class="col-xs-3 control-label">Casa</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mobilePhone" class="col-xs-3 control-label">Móvil</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Iglesias</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <select id="church" name="church" class="form-control church"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-church" title="Añadir cura">
                                        <i class="fa fa-arrow-circle-down"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="churches"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewPriest" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-priest" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Cura</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div class="form-group">
                        <label for="notified" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label">Avisado</label>
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <select id="notified" name="notified" class="form-control">
                                <option value="1">Sí</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditPriest" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
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
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address">
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
                        <label for="homePhone" class="col-xs-3 control-label">Casa</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mobilePhone" class="col-xs-3 control-label">Móvil</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone">
                            <span class="inputError" id="mobilePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone">
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
                <form class="form-horizontal" id="formEditGravedigger" name="formEditGravedigger">
                    <div class="form-group">
                        <label for="notified" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label">Avisado</label>
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <select id="notified" name="notified" class="form-control">
                                <option value="1">Sí</option>
                                <option value="0">No</option>
                            </select>
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

<div class="modal fade" id="modal-new-carrier" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Porteador</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                <div id="msg"></div>
                    <div class="form-group">
                        <label for="name" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">NIF</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control autocompleteNif" id="nif" name="nif">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Apellidos</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="surname" name="surname">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Dirección</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="address" name="address">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-4 control-label">Provincia</label>
                        <div class="col-xs-8">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group form-group-location">
                        <label for="location" class="col-xs-4 control-label">Localidad</label>
                        <div class="col-xs-8">
                            <select id="location" name="location" class="form-control location"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">E-mail</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="email" size="30" class="form-control" id="mail" name="mail">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Teléfonos</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone">                                
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <span class="inputError" id="phoneError"></span>
                            <div class="phones"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="drives" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Conduce</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <select id="drives" name="drives" class="form-control select2">
                                <option></option>
                                <option value="Coche">Coche</option>
                                <option value="Furgoneta">Furgoneta</option>
                                <option value="Coche y furgoneta">Coche y Furgoneta</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Fecha de Entrada</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <div class="input-group date">
                                    <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                    </div>
                                    <input type="text" size="25" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="off">
                                </div>
                            </div>
                            <span class="inputError" id="entryDateError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewCarrier" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal-new-choir" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Coro</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewChoir" name="formNewChoir">
                    <div id="msg"></div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control autocompleteNif" id="nif" name="nif">
                            <span class="inputError" id="nifError"></span>
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
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address">
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
                            <select id="location" name="location" class="form-control location" disabled></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="homePhone" class="col-xs-3 control-label">Casa</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mobilePhone" class="col-xs-3 control-label">Móvil</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone">
                            <span class="inputError" id="mobilePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone">
                            <span class="inputError" id="otherPhoneError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewchoir" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal-new-bellringer" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Campanero</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewBellringer" name="formNewBellringer">
                <div id="msg"></div>
                <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address">
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
                            <input type="text" size="30" class="form-control" id="area" name="area">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="parish" class="col-xs-3 control-label">Parroquia</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="parish" name="parish">
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
                        <label for="homePhone" class="col-xs-3 control-label">Casa</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mobilePhone" class="col-xs-3 control-label">Móvil</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="otherPhone" class="col-xs-3 control-label">Otro</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Iglesias</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <select id="church" name="church" class="form-control church"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-church" title="Añadir iglesia">
                                        <i class="fa fa-arrow-circle-down"></i>
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
<div class="modal fade" id="modal-edit-carrier" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Porteador</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditCarrier" name="formEditCarrier">
                    <div class="form-group">
                        <label for="confirmed" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label">Confirmado</label>
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <select id="confirmed" name="confirmed" class="form-control">
                                <option value="1">Sí</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditCarrier" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal-new-car" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Nuevo <span class="bolder">Coche</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewVehicle" name="formNewVehicle">
                <div class="form-group">
                        <label for="licensePlate" class="col-xs-3 control-label">Matrícula</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="licensePlate" name="licensePlate" class="form-control" />
                            <span class="inputError" id="licensePlateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="imei" class="col-xs-3 control-label">IMEI</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="imei" name="imei" class="form-control" />
                            <span class="inputError" id="imeiError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="brand" class="col-xs-3 control-label">Marca</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="brand" name="brand" class="form-control" />
                            <span class="inputError" id="brandError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="model" class="col-xs-3 control-label">Modelo</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="model" name="model" class="form-control" />
                            <span class="inputError" id="modelError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="kms" class="col-xs-3 control-label">Kilómetros</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="kms" name="kms" class="form-control" />
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="maintenance" class="col-xs-3 control-label">Mantenimiento</label>
                        <div class="col-xs-9">
                            <input type="checkbox" size="30" id="maintenance" name="maintenance" />
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="chassis" class="col-xs-3 control-label">Chasis</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="chassis" name="chassis" class="form-control" />
                        </div>                
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-xs-3 control-label">Uso</label>
                        <div class="col-xs-9">
                            <select id="type" class="form-control">
                                <option value="0">--</option>
                                <option value="1">Iglesia</option>
                                <option value="2">Incineración</option>
                                <option value="3">Familia</option>
                                <option value="4">Fúnebre</option>
                                <option value="5">Furgoneta</option>
                            </select>
                        </div>                
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" id="external" name="external" /> Subcontratado
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewVehicle" name="saveNewVehicle" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-car" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Editar <span class="bolder">Coche</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="datos" name="datos" action="" method="post">
                    <div class="form-group">
                        <label for="driverAdd" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 control-label">Añadir conductor</label>
                        <div class="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                            <select id="driverAdd" name="driverAdd users" class="form-control select2"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cleanBeforeAdd" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 control-label">Añadir Limp. antes</label>
                        <div class="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                            <select id="cleanBeforeAdd" name="cleanBeforeAdd users" class="form-control select2"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cleanAfterAdd" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 control-label">Añadir Limp. después</label>
                        <div class="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                            <select id="cleanAfterAdd" name="cleanAfterAdd users" class="form-control select2"></select>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditCar" type="button" class="btn btn-primary btn-add-car"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-summary" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Resumen <span class="bolder">Servicio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditSummary" name="formEditSummary">
                    <input type="hidden" id="expedient" value="">
                    <div class="form-group">
                        <label for="deceased" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="48" class="form-control" id="deceased" name="deceased" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="route" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label">Ruta a seguir</label>
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <textarea class="form-control" cols="50" id="route" name="route" rows="4"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label" for="ashes">Datos Iglesia</label>
                        <input id="churchData" name="churchData" type="checkbox" class="form-check-input col-md-1 col-lg-1"  value="churchData">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label" for="ashes">Licencia</label>
                        <input id="license" name="license" type="checkbox" class="form-check-input col-md-1 col-lg-1"  value="license">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label" for="ashes">Recibís</label>
                        <input id="receive" name="receive" type="checkbox" class="form-check-input col-md-1 col-lg-1"  value="receive">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label" for="ashes">Recordatorios</label>
                        <input id="reminder" name="reminder" type="checkbox" class="form-check-input col-md-1 col-lg-1"  value="reminder">
                    </div>
                    <div class="form-group">
                        <label for="notes" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 control-label">Notas</label>
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <textarea class="form-control" cols="50" id="notes" name="notes" rows="4"></textarea>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveSummary" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                        <button type="button" id="pdfSummary" class="btn btn-default "><i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-view-orders" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Pedidos <span class="bolder">de compra</span></h4>
            </div>
            <div class="modal-body">
                <div class="orders"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-send-email" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Pedidos <span class="bolder">de compra</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="orderID">
                <fieldset>
                    <legend>Datos</legend>
                    <fieldset>
                        <legend>Pedido de compra</legend>
                        <div class="col-xs-4 centered">
                            <p>Nº Pedido: <span id="number" class="label label-primary small"></span></p>
                            <p>Teléfono: <span id="supplierPhone" class="bolder"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p>Fecha: <span id="date" class="bolder"></span></p>
                            <p>Fax: <span id="supplierFax" class="bolder"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p>Proveedor:</p>
                            <p><span id="supplierName" class="bolder"></span></p>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Descripción del pedido</legend>
                        <div class="row">
                            <div class="col-xs-6">
                                <div id="orderLines"></div>
                            </div>
                            <div class="col-xs-6">
                                <ul>
                                    <li class="bolder">Def.<span id="deceased"></span>, Nº Exp: <span id="expedient"></span></li>
                                    <li>Lugar de entrega: <span id="deliveryPlace"></span></li>
                                    <li>Fecha de entrega: <span id="deliveryDate"></span></li>
                                </ul>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Notas</legend>
                        <textarea class="form-control" id="notes" rows="3" cols="60"></textarea>
                        <br/>
                    </fieldset>
                    <fieldset>
                        <legend>Enviar a:<span id="send" class="bolder"></span></legend>
                        <label for="sendCopy" class="col-xs-4">Copia para:</label>
                        <input type="text" class="form-control col-xs-8" id="sendCopy">
                        <br><br>
                        <label id="sentEmail"></label>
                    </fieldset>
                </fieldset>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="sendEmail" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Enviar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-send-email1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Pedidos <span class="bolder">de compra</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="orderID">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Datos</span></legend>
                    <br>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Pedido de compra</span></legend>
                        <div class="col-xs-4 centered">
                            <p>Nº Pedido: <span id="number" class="label label-primary small"></span></p>
                            <p>Teléfono: <span id="supplierPhone" class="bolder"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p>Fecha: <span id="date" class="bolder"></span></p>
                            <p>Fax: <span id="supplierFax" class="bolder"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p>Proveedor:</p>
                            <p><span id="supplierName" class="bolder"></span></p>
                            <p><span id="supplierID" class="hide"></span></p>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Descripción del pedido</span></legend>
                        <div class="row" style="margin-top:5px">
                            <div class="col-xs-12">
                                <ul>
                                    <li class="bolder">Def.<span id="deceased"></span>, Nº Exp: <span id="expedient"></span></li>
                                    <li>Lugar de entrega: <span id="deliveryPlace"></span></li>
                                    <li>Fecha de entrega: <span id="deliveryDate"></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div id="orderLines"></div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Notas</span></legend>
                        <textarea class="form-control" id="notes" rows="3" cols="140" style="margin-top: 10px;"></textarea>
                        <br/>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Enviar a:</span>&nbsp;<span id="send" class="bolder"></span></legend>
                        <div style="margin-top: 15px;margin-bottom: 5px;">
                            <label for="sendCopy" class="col-xs-2">Copia para:</label>
                            <input type="text" size="30" class="form-control col-xs-8" id="sendCopy" style="margin-left: -50px;margin-bottom:15px">
                            <label class="label label-success" style='margin-left: 5%;' id="sentEmail"></label>
                        </div>
                        <br>
                    </fieldset>
                </fieldset>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="sendEmail1" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Enviar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-sign-cremation" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Dispositivos para firmar</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="docname">
                <input type="hidden" id="docpath">
                <div class="alert alert-info hide" id="signConfirmMobile">En breves se enviará una petición de firma al dispositivo móvil vinculado</div>
                <div class="alert alert-info hide" id="signConfirmDesktop">
                    En breves se abrirá una nueva pestaña para seleccionar el tipo de firma.
                    Una vez que firme el documento, cierre la pestaña para volver a la aplicación
                </div>
                <span for="signMobile">Firma mediante aplicación móvil (Android/iOS)</span><br>
                <button type="button" class="btn btn-primary" id="signMobile"><i class="fa fa-android" aria-hidden="true"></i> / <i class="fa fa-apple" aria-hidden="true"></i> Firmar</button>
                <br><br>
                <span for="signDesktop">Firma mediante Wacom o navegador</span><br>
                <button type="button" class="btn btn-primary" id="signDesktop"><i class="fa fa-tablet" aria-hidden="true"></i> / <i class="fa fa-laptop" aria-hidden="true"></i></i> Firmar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-sign-generated" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Dispositivos para firmar</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="docname">
                <input type="hidden" id="docpath">
                <div class="alert alert-info hide" id="signConfirmMobile">En breves se enviará una petición de firma al dispositivo móvil vinculado</div>
                <div class="alert alert-info hide" id="signConfirmDesktop">
                    En breves se abrirá una nueva pestaña para seleccionar el tipo de firma.
                    Una vez que firme el documento, cierre la pestaña para volver a la aplicación
                </div>
                <span for="signMobile">Firma mediante aplicación móvil (Android/iOS)</span><br>
                <button type="button" class="btn btn-primary" id="signMobile"><i class="fa fa-android" aria-hidden="true"></i> / <i class="fa fa-apple" aria-hidden="true"></i> Firmar</button>
                <br><br>
                <span for="signDesktop">Firma mediante Wacom o navegador</span><br>
                <button type="button" class="btn btn-primary" id="signDesktop"><i class="fa fa-tablet" aria-hidden="true"></i> / <i class="fa fa-laptop" aria-hidden="true"></i></i> Firmar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-vivorecuerdo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Enviar a <span class="bolder">Vivo Recuerdo</span></h4>
            </div>
            <div class="messageVivorecuerdo"></div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditVivorecuerdo" name="formEditVivorecuerdo">
                    <div class="form-group">
                        <label for="deceasedDate" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Fecha de defunción</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <div class="input-group date">
                                    <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                    </div>
                                    <input type="text" size="30" class="form-control datepicker" id="deceasedDate" name="deceasedDate" autocomplete="off">
                                </div>
                            </div>
                            <span class="inputError" id="deceasedDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedLocation" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Localidad</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="deceasedLocation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedName" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Nombre difunto</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="deceasedName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedSurname" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Apellidos difunto</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="deceasedSurname">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="extraText" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Sobrenombre</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="extraText">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedBirthday" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Fecha de nacimiento</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <div class="input-group date">
                                    <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                    </div>
                                    <input type="text" size="30" class="form-control datepicker" id="deceasedBirthday" name="deceasedBirthday" autocomplete="off">
                                </div>
                            </div>
                            <span class="inputError" id="deceasedBirthdayError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedBirthdayLocationName" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Lugar de nacimiento</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="deceasedBirthdayLocationName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedBirthdayLocationProvince" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Provincia o país de nacimiento</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="deceasedBirthdayLocationProvince">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="funeralDate" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Fecha ceremonia</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <div class="input-group date">
                                    <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                    </div>
                                    <input type="text" size="30" class="form-control datepicker" id="funeralDate" name="funeralDate" autocomplete="off">
                                </div>
                            </div>
                            <span class="inputError" id="funeralDateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="churchName" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Lugar ceremonia</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="churchName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="churchLocationName" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Población ceremonia</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="churchLocationName">
                        </div>
                    </div>
                    <div class="form-group bootstrap-timepicker timepicker">
                        <label for="funeralTime" class="col-xs-4 control-label">Hora ceremonia</label>
                        <div class="col-xs-8">
                            <input type="text" size="35" class="form-control time" id="funeralTime" name="funeralTime">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="destination" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Inhumación / Cremación</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <select class="form-control" id="destination" style="min-width: 246px;">
                                <option value="cementerio">Inhumación</option>
                                <option value="crematorio">Cremación</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="destinationName" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Nombre del cementerio o del crematorio</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="destinationName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="destinationLocation" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Población del cementerio o del crematorio</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="destinationLocation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deceasedRoom" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Nº sala</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="deceasedRoom">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone1" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">* Teléfono de contacto 1</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="phone1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone2" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Teléfono de contacto 2</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="phone2">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone3" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Teléfono de contacto 3</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="phone3">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone4" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Teléfono de contacto 4</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="phone4">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone5" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Teléfono de contacto 5</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="phone5">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="sendToVivorecuerdo" type="button" class="btn btn-primary "><i class="fa fa-paper-plane" aria-hidden="true"></i> Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-surveys" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar teléfono de <span class="bolder">Encuesta de satisfacción</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditSurvey" name="formEditSurvey">
                    <div class="form-group">
                        <label for="phoneSurveyEdit" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Teléfono</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" size="35" class="form-control" id="phoneSurveyEdit">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="goEditSurvey" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-surveys-balance-error" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder">no hay SMS disponibles</span></h4>
            </div>
            <div class="modal-body">
                <div class="form-grop">
                    <p>No se ha podido enviar la encuesta de satisfacción porque <strong>tienes disponibles <span id="balancePending"></span></strong> 
                        SMS y estás <strong>tratando de enviar <span id="totalSmsToSent"></span></strong>.
                    </p>
                    <p>Para aumentar la cantidad de SMS disponibles ponte en contacto con el <strong><u><a href="tel:988608190">servicio técnico</a></u></strong>.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-users-notes-thread" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close close-user-note-thread" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Seleccionar <span class="bolder">usuario</span></h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="usersNotesThread" class="col-sm-3 control-label">Usuarios:</label>
                    <div class="col-sm-9">
                        <select class="form-control select2" id="usersNotesThread"></select>
                        <p class="c-red hide" id="usersNotesThreadError">Debes seleccionar un usuario</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default close-user-note-thread" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button  id="selectUserThread" type="button" class="btn btn-primary"><i class="fa fa-save" aria-hidden="true"></i> Seleccionar</button>
            </div>
        </div>
    </div>
</div>