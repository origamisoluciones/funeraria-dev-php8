<div class="modal fade" id="modal-new-tax" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo/a <span class="bolder">Impuesto/Tasa</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewTax" name="formNewTax">
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="startDate" class="col-xs-4 control-label">Período (desde)</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="Período (desde)" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="startDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="endDate" class="col-xs-4 control-label">Período (hasta)</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="endDate" name="endDate" aria-describedby="Período (hasta)" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="endDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="creationDate" class="col-xs-4 control-label">Fecha</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="creationDate" name="creationDate" aria-describedby="Fecha creacion" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="creationDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="expirationDate" class="col-xs-4 control-label">Fecha de vencimiento</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="expirationDate" name="expirationDate" aria-describedby="Fecha vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="expirationDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="costCenter" class="col-xs-4 control-label">Centro de coste</label>
                            <div class="col-xs-8">
                                <select id="costCenter" name="costCenter" class="form-control costCenter"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="settlementDate" class="col-xs-4 control-label">Fecha de pago</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="settlementDate" name="settlementDate" aria-describedby="Fecha pago" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="settlementDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="paymentMethod" class="col-xs-4 control-label">Método de pago</label>
                            <div class="col-xs-8">
                                <select id="paymentMethod" name="paymentMethod" class="form-control">
                                    <option value="1">Líquido</option>
                                    <option value="2">Cargo en cuenta</option>
                                    <option value="3">Transferencia</option>
                                    <option value="4">Tarjeta de crédito</option>
                                </select>
                            </div>
                        </div>
                        <div class="hide" id="bankAccounts">
                            <div class="col-xs-6">
                                <label for="bankAccount" class="col-xs-4 control-label">Cuenta bancaria</label>
                                <div class="col-xs-8">
                                    <select id="bankAccount" name="bankAccount" class="form-control"></select>
                                    <span class="inputError" id="bankAccountError"></span>
                                </div>
                            </div>
                        </div>                        
                        <div class="hide" id="creditCards">
                            <div class="col-xs-6">
                                <label for="creditCard" class="col-xs-4 control-label">Tarjeta de crédito</label>
                                <div class="col-xs-8">
                                    <select id="creditCard" name="creditCard" class="form-control"></select>
                                    <span class="inputError" id="creditCardError"></span>
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="expenseType" class="col-xs-4 control-label">Tipo de gasto</label>
                            <div class="col-xs-8">
                                <select id="expenseType" name="expenseType" class="form-control">
                                    <option value="1">Recuperable</option>
                                    <option value="2">No deducible</option>
                                    <option value="3">Gasto</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="shipperType" class="col-xs-4 control-label">Tipo de expedidor</label>
                            <div class="col-xs-8">
                                <select id="shipperType" name="shipperType" class="form-control shipperType"></select>
                                <span class="inputError" id="shipperTypeError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="tax_base" class="col-xs-4 control-label">Importe</label>
                            <div class="col-xs-8">
                                <input type="number" min="0" id="tax_base" name="tax_base" class="form-control" autocomplete="none">
                                <span class="inputError" id="tax_baseError"></span>
                            </div>                  
                        </div>
                    </div>        
                    <div class="row form-group">
                        <label for="concept" class="col-xs-2 control-label">Concepto</label>
                        <div class="col-xs-10">
                            <textarea class="form-control" name="concept" id="concept" rows="4" cols="110" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div class="row form-group">
                        <label for="comments" class="col-xs-2 control-label">Comentarios</label>
                        <div class="col-xs-10">
                            <textarea class="form-control" name="comments" id="comments" rows="4" cols="110" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div class="row form-group">
                        <label class="col-xs-2 control-label">Adjuntar archivo</label>
                        <div class="col-xs-10">
                            <input type="file" style="border:0;" class="form-control" name="fileAttachDoc" id="fileAttachDoc" accept=".pdf">
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewTax" name="saveNewTax" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-tax" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Impuesto/Tasa</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditTax" name="formEditTax">
                    <input type="hidden" id="ID">
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="startDate" class="col-xs-4 control-label">Período (desde)</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="Período (desde)" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="startDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="endDate" class="col-xs-4 control-label">Período (hasta)</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="endDate" name="endDate" aria-describedby="Período (hasta)" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="endDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="creationDate" class="col-xs-4 control-label">Fecha</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="creationDate" name="creationDate" aria-describedby="Fecha creacion" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="creationDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="expirationDate" class="col-xs-4 control-label">Fecha de vencimiento</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="expirationDate" name="expirationDate" aria-describedby="Fecha vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="expirationDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="costCenter" class="col-xs-4 control-label">Centro de coste</label>
                            <div class="col-xs-8">
                                <select id="costCenter" name="costCenter" class="form-control costCenter"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="settlementDate" class="col-xs-4 control-label">Fecha de pago</label>
                            <div class="col-xs-8">
                                <div class="input-group date">
                                    <input type="text" size="20" class="form-control datepicker" id="settlementDate" name="settlementDate" aria-describedby="Fecha pago" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="settlementDateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="paymentMethod" class="col-xs-4 control-label">Método de pago</label>
                            <div class="col-xs-8">
                                <select id="paymentMethod" name="paymentMethod" class="form-control">
                                    <option value="1">Líquido</option>
                                    <option value="2">Cargo en cuenta</option>
                                    <option value="3">Transferencia</option>
                                    <option value="4">Tarjeta de crédito</option>
                                </select>
                            </div>
                        </div>
                        <div class="hide" id="bankAccounts">
                            <div class="col-xs-6">
                                <label for="bankAccount" class="col-xs-4 control-label">Cuenta bancaria</label>
                                <div class="col-xs-8">
                                    <select id="bankAccount" name="bankAccount" class="form-control"></select>
                                    <span class="inputError" id="bankAccountError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hide" id="creditCards">
                            <div class="col-xs-6">
                                <label for="creditCard" class="col-xs-4 control-label">Tarjeta de crédito</label>
                                <div class="col-xs-8">
                                    <select id="creditCard" name="creditCard" class="form-control"></select>
                                    <span class="inputError" id="creditCardError"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="expenseType" class="col-xs-4 control-label">Tipo de gasto</label>
                            <div class="col-xs-8">
                                <select id="expenseType" name="expenseType" class="form-control">
                                    <option value="1">Recuperable</option>
                                    <option value="2">No deducible</option>
                                    <option value="3">Gasto</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="shipperType" class="col-xs-4 control-label">Tipo de expedidor</label>
                            <div class="col-xs-8">
                                <select id="shipperType" name="shipperType" class="form-control shipperType"></select>
                                <span class="inputError" id="shipperTypeError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="tax_base" class="col-xs-4 control-label">Importe</label>
                            <div class="col-xs-8">
                                <input type="number" min="0" id="tax_base" name="tax_base" class="form-control">
                                <span class="inputError" id="tax_baseError"></span>
                            </div>                  
                        </div>
                    </div>  
                    <div class="row form-group">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label for="concept" class="col-xs-2 control-label">Concepto</label>
                            <div class="col-xs-10">
                                <textarea class="form-control" name="concept" id="concept" rows="5" cols="110" autocomplete="none"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label for="comments" class="col-xs-2 control-label">Comentarios</label>
                            <div class="col-xs-10">
                                <textarea class="form-control" name="comments" id="comments" rows="4" cols="110" autocomplete="none"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <label class="col-xs-2 control-label">Adjuntar archivo</label>
                        <div class="col-xs-10">
                            <input type="file" style="border:0;" class="form-control" name="fileAttachDocEdit" id="fileAttachDocEdit" accept=".pdf">
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditTax" name="saveEditTax" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>