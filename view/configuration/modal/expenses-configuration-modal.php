<div class="modal fade" id="modal-new-expense-fixed" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Gasto fijo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDataFixed" name="formNewDataFixed">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDataFixed" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-expense-variable" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Gasto variable</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDataVariable" name="formNewDataVariable">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDataVariable" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-bank-account" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Cuenta bancaria</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDataBankAccount" name="formNewDataBankAccount">
                    <div class="form-group">
                        <label for="alias" class="col-xs-3 control-label">Alias</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="alias" name="alias" autocomplete="none">
                            <span class="inputError" id="aliasError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="number" class="col-xs-3 control-label">Nº de cuenta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="number" name="number" autocomplete="none">
                            <span class="inputError" id="numberError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="owner" class="col-xs-3 control-label">Titular</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="owner" name="owner" autocomplete="none">
                            <span class="inputError" id="ownerError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="bank" class="col-xs-3 control-label">Entidad Bancaria</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="bank" name="bank" autocomplete="none">
                            <span class="inputError" id="bankError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDataBankAccount" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-credit-card" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Tarjeta de crédito/débito</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDataCreditCard" name="formNewDataCreditCard">
                    <div class="form-group">
                        <label for="number" class="col-xs-3 control-label">Nº de tarjeta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="number" name="number">
                            <span class="inputError" id="numberError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="owner" class="col-xs-3 control-label">Titular</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="owner" name="owner">
                            <span class="inputError" id="ownerError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDataCreditCard" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-salary-template" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Plantilla de salario</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewSalaryTemplate">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre plantilla</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="name" name="name" class="form-control">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="costCenter" class="col-xs-3 control-label">Centro de coste</label>
                        <div class="col-xs-9">
                            <select id="costCenter" name="costCenter" class="form-control"></select>
                            <br><span class="inputError" id="costCenterError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="startDay" class="col-xs-3 control-label">Período</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <div class="input-group-addon input-sm">DESDE</div>
                                <input type="number" min="0" id="startDay" name="startDay" class="form-control"  placeholder="Día del mes">
                            </div>
                            <span class="inputError" id="startDayError"></span>
                            <div class="input-group separate">
                                <div class="input-group-addon input-sm">HASTA</div>
                                <input type="number" min="1" max="31" id="endDay" name="endDay" class="form-control" placeholder="Día del mes">
                            </div>
                            <span class="inputError" id="endDayError"></span>
                        </div>
                    </div>
                    <div class="form-group clearfix">
                        <label for="taxBase" class="col-xs-3 control-label">Importe de la base</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="taxBase" name="taxBase" class="form-control">
                            <span class="inputError" id="taxBaseError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="IRPF" class="col-xs-3 control-label">IRPF (retención)</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="IRPF" name="IRPF" class="form-control">
                            <span class="inputError" id="IRPFError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="liquid" class="col-xs-3 control-label">Líquido</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="liquid" name="liquid" class="form-control">
                            <span class="inputError" id="liquidError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="paymentDay" class="col-xs-3 control-label">Día de pago</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="paymentDay" name="paymentDay" class="form-control">
                            <span class="inputError" id="paymentDayError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewSalaryTemplate" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-shipper" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Expedidor</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewShipper" name="formNewShipper">                    
                    <div class="form-group">
                        <label for="shipperName" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="shipperName" name="shipperName">
                            <span class="inputError" id="shipperNameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewShipper" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-tpv" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">TPV de Cobro</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewTPV" name="formNewTPV">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="tpvNumAccount" class="col-xs-3 control-label">Núm. de Cuenta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="tpvNumAccount" name="tpvNumAccount">
                            <span class="inputError" id="tpvNumAccountError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewTPV" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-expense-fixed" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Gasto fijo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataFixed" name="formEditDataFixed">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDataFixed" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-expense-variable" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Gasto variable</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataVariable" name="formEditDataVariable">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDataVariable" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-bank-account" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Cuenta bancaria</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataBankAccount" name="formEditDataBankAccount">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="alias" class="col-xs-3 control-label">Alias</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="alias" name="alias">
                            <span class="inputError" id="aliasError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="number" class="col-xs-3 control-label">Nº de cuenta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="number" name="number">
                            <span class="inputError" id="numberError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="owner" class="col-xs-3 control-label">Titular</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="owner" name="owner">
                            <span class="inputError" id="ownerError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="bank" class="col-xs-3 control-label">Entidad Bancaria</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="bank" name="bank">
                            <span class="inputError" id="bankError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDataBankAccount" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-credit-card" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Tarjeta de crédito/débito</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataCreditCard" name="formEditDataCreditCard">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="number" class="col-xs-3 control-label">Nº de tarjeta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="number" name="number">
                            <span class="inputError" id="numberError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="owner" class="col-xs-3 control-label">Titular</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="owner" name="owner">
                            <span class="inputError" id="ownerError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDataCreditCard" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-salary-template" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Plantilla de salarios</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditSalaryTemplate">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre plantilla</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="name" name="name" class="form-control" aria-describedby="Nombre" />
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="costCenter" class="col-xs-3 control-label">Centro de coste</label>
                        <div class="col-xs-9">
                            <select id="costCenter" name="costCenter" class="form-control"></select>
                            <br><span class="inputError" id="costCenterError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="startDay" class="col-xs-3 control-label">Período</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <div class="input-group-addon input-sm">DESDE</div>
                                <input type="number" min="0" id="startDay" name="startDay" class="form-control" placeholder="Día del mes">
                            </div>
                            <span class="inputError" id="startDayError"></span>
                            <div class="input-group separate">
                                <div class="input-group-addon input-sm">HASTA</div>
                                <input type="number" min="0" id="endDay" name="endDay" class="form-control" placeholder="Día del mes">
                            </div>
                            <span class="inputError" id="endDayError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="taxBase" class="col-xs-3 control-label">Importe de la base</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="taxBase" name="taxBase" class="form-control">
                            <span class="inputError" id="taxBaseError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="IRPF" class="col-xs-3 control-label">IRPF (retención)</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="IRPF" name="IRPF" class="form-control">
                            <span class="inputError" id="IRPFError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="liquid" class="col-xs-3 control-label">Líquido</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="liquid" name="liquid" class="form-control">
                            <span class="inputError" id="liquidError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="paymentDay" class="col-xs-3 control-label">Día de pago</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" id="paymentDay" name="paymentDay" class="form-control">
                            <span class="inputError" id="paymentDayError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditSalaryTemplate" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-shipper" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Expedidor</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditShipper" name="formEditShipper">
                    <input type="hidden" id="ID">                    
                    <div class="form-group">
                        <label for="shipperName" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="shipperName" name="shipperName">
                            <span class="inputError" id="shipperNameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditShipper" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-tpv" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">TPV de Cobro</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditTPV" name="formEditTPV">
                    <input type="hidden" id="ID">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="tpvNumAccount" class="col-xs-3 control-label">Núm. de Cuenta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="tpvNumAccount" name="tpvNumAccount">
                            <span class="inputError" id="tpvNumAccountError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditTPV" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>