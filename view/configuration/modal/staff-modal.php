<div class="modal fade" id="modal-new-staff" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Personal</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                <div id="msg"></div>
                    <div class="form-group">
                        <label for="code" class="col-xs-3 control-label">Puesto</label>
                        <div class="col-xs-9" id="posts"></div>
                    </div>
                    <div class="form-group">
                        <label for="code" class="col-xs-3 control-label">Código</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="code" name="code" autocomplete="none">
                            <span class="inputError" id="codeError"></span>
                        </div>
                    </div>
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
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dischargeDay" class="col-lg-3 col-md-3 col-sm-12 col-xs-12 control-label">Fecha de alta</label>
                        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group dischargeDay">
                                <input type="text" size="30" class="form-control datepicker" id="dischargeDay" name="dischargeDay" autocomplete="none">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nuss" class="col-xs-3 control-label">NUSS</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nuss" name="nuss" autocomplete="none">
                            <span class="inputError" id="nussError"></span>
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
                        <label for="email" class="col-xs-3 control-label">Correo</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="email" name="email" autocomplete="none">
                            <span class="inputError" id="emailError"></span>
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
                        <label for="extension" class="col-xs-3 control-label">Extensión telefónica</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="extension" name="extension" autocomplete="none">
                            <span class="inputError" id="extensionError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber" class="col-xs-3 control-label">Cuenta bancaria</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="accountNumber" name="accountNumber" autocomplete="none">
                            <span class="inputError" id="accountNumberError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="user" class="col-xs-3 control-label">Usuario asociado</label>
                        <div class="col-xs-9">
                            <select id="user" name="user" class="form-control"></select>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewStaff" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-staff" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Personal</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <input type="hidden" id="staffID" name="staffID" value="">
                    <div class="form-group">
                        <label for="code" class="col-xs-3 control-label">Puesto</label>
                        <div class="col-xs-9" id="posts"></div>
                    </div>
                    <div class="form-group">
                        <label for="code" class="col-xs-3 control-label">Código</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="code" name="code" autocomplete="none">
                            <span class="inputError" id="codeError"></span>
                        </div>
                    </div>
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
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dischargeDay" class="col-lg-3 col-md-3 col-sm-12 col-xs-12 control-label">Fecha de alta</label>
                        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group dischargeDay">
                                <input type="text" size="30" class="form-control datepicker" id="dischargeDay" name="dischargeDay" autocomplete="none">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="downDate" class="col-lg-3 col-md-3 col-sm-12 col-xs-12 control-label">Fecha de baja</label>
                        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group downDate">
                                <input type="text" size="30" class="form-control datepicker" id="downDate" name="downDate" autocomplete="none">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nuss" class="col-xs-3 control-label">NUSS</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nuss" name="nuss" autocomplete="none">
                            <span class="inputError" id="nussError"></span>
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
                        <label for="email" class="col-xs-3 control-label">Correo</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="email" name="email" autocomplete="none">
                            <span class="inputError" id="emailError"></span>
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
                        <label for="extension" class="col-xs-3 control-label">Extensión telefónica</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="extension" name="extension" autocomplete="none">
                            <span class="inputError" id="extensionError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber" class="col-xs-3 control-label">Cuenta bancaria</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="accountNumber" name="accountNumber" autocomplete="none">
                            <span class="inputError" id="accountNumberError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="user" class="col-xs-3 control-label">Usuario asociado</label>
                        <div class="col-xs-9">
                            <select id="user" name="user" class="form-control"></select>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditStaff" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>