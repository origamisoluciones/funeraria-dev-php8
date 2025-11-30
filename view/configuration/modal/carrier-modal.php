<div class="modal fade" id="modal-new-carrier" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-backdrop="static">
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
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" size="30" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" class="form-control" id="surname" name="surname" autocomplete="none">
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
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <div class="phones"></div>
                            <span class="inputError" id="phoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="drives" class="col-xs-3 control-label">Conduce</label>
                        <div class="col-xs-9">
                            <select id="drives" name="drives" class="form-control select2">
                                <option></option>
                                <option value="Coche">Coche</option>
                                <option value="Furgoneta">Furgoneta</option>
                                <option value="Coche y furgoneta">Coche y Furgoneta</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-xs-3 control-label">Fecha de Entrada</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
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

<div class="modal fade" id="modal-edit-carrier" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Porteador</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <input type="hidden" id="carrierID" name="carrierID" value="">
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
                            <input type="text" size="30" class="form-control" id="nif" name="nif"  class="autocompleteNif" autocomplete="none">
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
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <div class="phones"></div>
                            <span class="inputError" id="phoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="drives" class="col-xs-3 control-label">Conduce</label>
                        <div class="col-xs-9">
                            <select id="drives" name="drives" class="form-control select2">
                                <option></option>
                                <option value="Coche">Coche</option>
                                <option value="Furgoneta">Furgoneta</option>
                                <option value="Coche y furgoneta">Coche y Furgoneta</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-xs-3 control-label">Fecha de Entrada</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditCarrier" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>