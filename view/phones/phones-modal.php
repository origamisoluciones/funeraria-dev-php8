<div class="modal fade" id="modal-new-phone" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Listado</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="category" class="col-xs-4 control-label">Categoría</label>
                        <div class="col-xs-8">
                            <select id="categories"></select>
                        </div>
                    </div>
                    <div class="form-group" id="groupName">
                        <label for="name" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupHomePhone">
                        <label for="homePhone" class="col-xs-4 control-label">Casa</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="homePhone" name="homePhone">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupMobilePhone">
                        <label for="mobilePhone" class="col-xs-4 control-label">Móvil</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="mobilePhone" name="mobilePhone">
                            <span class="inputError" id="mobilePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupOtherPhone">
                        <label for="otherPhone" class="col-xs-4 control-label">Otro</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="otherPhone" name="otherPhone">
                            <span class="inputError" id="otherPhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupFax">
                        <label for="fax" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="fax" name="fax">
                        </div>
                    </div>
                    <div id="groupLocation">
                        <div class="form-group">
                            <label for="province" class="col-xs-4 control-label">Provincia</label>
                            <div class="col-xs-8">
                                <select id="province" name="province" class="form-control province"></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="location" class="col-xs-4 control-label">Localidad</label>
                            <div class="col-xs-8">
                                <select id="location" name="location" class="form-control location"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="groupParish">
                        <label for="parish" class="col-xs-4 control-label">Parroquia</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="parish" name="parish">
                        </div>
                    </div>
                    <div class="form-group" id="groupArea">
                        <label for="area" class="col-xs-4 control-label">Área</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="area" name="area">
                        </div>
                    </div>
                    <div class="form-group" id="groupPay">
                        <label for="pay" class="col-xs-4 control-label">Pago</label>
                        <div class="col-xs-8">
                            <input type="checkbox" id="pay" name="pay">
                        </div>
                    </div>
                    <div class="form-group" id="groupEmail">
                        <label for="email" class="col-xs-4 control-label">Correo</label>
                        <div class="col-xs-8">
                            <input type="email" size="30" class="form-control" id="email" name="email">
                        </div>
                    </div>
                    <div class="form-group" id="groupDescription">
                        <label for="description" class="col-xs-4 control-label">Descripción</label>
                        <div class="col-xs-8">
                            <textarea class="form-control" id="description" name="description" rows="3" cols="32"></textarea>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewPhone" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-phone" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Listado</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="category" class="col-xs-4 control-label">Categoría</label>
                        <div class="col-xs-8">
                            <input type="hidden" id="categoryID">
                            <input type="text" size="30" class="form-control" id="category" name="category" disabled>
                        </div>
                    </div>
                    <div class="form-group" id="groupName">
                        <label for="name" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupHomePhone">
                        <label for="homePhone" class="col-xs-4 control-label">Casa</label>
                        <div class="col-xs-8">
                            <input type="text" class="form-control" size="30" id="homePhone" name="homePhone">
                            <span class="inputError" id="homePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupMobilePhone">
                        <label for="mobilePhone" class="col-xs-4 control-label">Móvil</label>
                        <div class="col-xs-8">
                            <input type="text" class="form-control" size="30" id="mobilePhone" name="mobilePhone">
                            <span class="inputError" id="mobilePhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupOtherPhone">
                        <label for="otherPhone" class="col-xs-4 control-label">Otro</label>
                        <div class="col-xs-8">
                            <input type="text" class="form-control" size="30" id="otherPhone" name="otherPhone">
                            <span class="inputError" id="otherPhoneError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="groupFax">
                        <label for="fax" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="fax" name="fax">
                        </div>
                    </div>
                    <div id="groupLocation">
                        <div class="form-group">
                            <label for="province" class="col-xs-4 control-label">Provincia</label>
                            <div class="col-xs-8">
                                <select id="province" name="province" class="form-control province"></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="location" class="col-xs-4 control-label">Localidad</label>
                            <div class="col-xs-8">
                                <select id="location" name="location" class="form-control location"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="groupParish">
                        <label for="parish" class="col-xs-4 control-label">Parroquia</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="parish" name="parish">
                        </div>
                    </div>
                    <div class="form-group" id="groupArea">
                        <label for="area" class="col-xs-4 control-label">Área</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="area" name="area">
                        </div>
                    </div>
                    <div class="form-group" id="groupPay">
                        <label for="pay" class="col-xs-4 control-label">Pago</label>
                        <div class="col-xs-8">
                            <input type="checkbox" id="pay" name="pay">
                        </div>
                    </div>
                    <div class="form-group" id="groupEmail">
                        <label for="email" class="col-xs-4 control-label">Correo</label>
                        <div class="col-xs-8">
                            <input type="email" size="30" class="form-control" id="email" name="email">
                        </div>
                    </div>
                    <div class="form-group" id="groupDescription">
                        <label for="description" class="col-xs-4 control-label">Descripción</label>
                        <div class="col-xs-8">
                            <textarea class="form-control" id="description" name="description" rows="3" cols="32"></textarea>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditPhone" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>