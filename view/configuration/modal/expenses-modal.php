<div class="modal fade" id="modal-new-expenses" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Gasto</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="entryDate" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de entrada</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group entryDate">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                                <input type="text" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="concept" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Concepto</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="concept" name="concept">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Tipo</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <select id="type" name="type" class="form-control select2">
                                <option value="individual">individual</option>
                                <option value="diario">diario</option>
                                <option value="semanal">semanal</option>
                                <option value="quincenal">quincenal</option>
                                <option value="bimestral">bimestral</option>
                                <option value="trimestral">trimestral</option>
                                <option value="cuatrimestral">cuatrimestral</option>
                                <option value="semestral">semestral</option>
                                <option value="anual">anual</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="bank" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Banco</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <select id="bank" name="bank" class="form-control select2">
                                <option></option>
                                <option>Caja</option>
                                <option>Banco</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cost" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Importe</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" min="0" class="form-control" id="cost" name="cost">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chargeDate" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de cargo</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group chargeDate">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                                <input type="text" class="form-control datepicker" id="chargeDate" name="chargeDate" autocomplete="none">
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dueDate" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de vencimiento</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group dueDate">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                                <input type="text" class="form-control datepicker" id="dueDate" name="dueDate" autocomplete="none">
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewExpenses" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-expensesL" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Gasto Individual</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataL" name="formEditData">
                    <input type="hidden" id="expenseID" name="expenseID" value="">
                    <div class="form-group">
                        <label for="entryDate" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de entrada</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                            <div class="input-group entryDate">
                                <div class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                                </div>
                                <input type="text" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="concept" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Concepto</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="concept" name="concept" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Tipo</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <select id="type" name="type" class="form-control select2" disabled>
                                <option value="individual">individual</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="bank" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Banco</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <select id="bank" name="bank" class="form-control select2">
                                <option></option>
                                <option>Caja</option>
                                <option>Banco</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cost" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Importe</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" min="0" class="form-control" id="cost" name="cost" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chargeDate" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de cargo</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                            <div class="input-group chargeDate">
                                <div class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                                </div>
                                <input type="text" class="form-control datepicker" id="chargeDate" name="chargeDate" autocomplete="none">
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dueDate" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de vencimiento</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                            <div class="input-group dueDate">
                                <div class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                                </div>
                                <input type="text" class="form-control datepicker" id="dueDate" name="dueDate" autocomplete="none">
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditExpensesL" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>