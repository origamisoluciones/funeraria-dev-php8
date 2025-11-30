<div class="modal fade" id="modal-new-received-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Factura recibida</span></h4>
            </div>
            <div class="modal-body">
                <form class="" id="formNewReceivedInvoice" name="formNewReceivedInvoice">
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="invoiceNumber" class="col-xs-4 control-label">Nº Factura</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="invoiceNumber" name="invoiceNumber" class="form-control" aria-describedby="invoiceNumber" autocomplete="none"/>
                                <span class="inputError" id="invoiceNumberError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="isTicket" name="isTicket"> Ticket
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="date" class="col-xs-5 control-label">Fecha de expedición</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="date" name="date" aria-describedby="fecha" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDate" class="col-xs-5 control-label">Fecha de pago</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="paymentDate" name="paymentDate" aria-describedby="fecha de pago" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="paymentDateError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate" class="col-xs-5 control-label">Fecha vencimiento a 30 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate" name="dueDate" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate" class="col-xs-5 control-label">Pago vencimiento a 30 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate" name="paymentDueDate" class="form-control" aria-describedby="paymentDueDate" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate2" class="col-xs-5 control-label">Fecha vencimiento a 60 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate2" name="dueDate2" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDate2Error"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate2" class="col-xs-5 control-label">Pago vencimiento a 60 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate2" name="paymentDueDate2" class="form-control" aria-describedby="paymentDueDate2" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate3" class="col-xs-5 control-label">Fecha vencimiento a 90 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate3" name="dueDate3" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDate3Error"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate3" class="col-xs-5 control-label">Pago vencimiento a 90 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate3" name="paymentDueDate3" class="form-control" aria-describedby="paymentDueDate3" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-5">
                            <label for="supplier" class="col-xs-4 control-label">Expedidor</label>
                            <div class="col-xs-8">
                                <div class="input-group">
                                    <select size="20" id="supplier" name="supplier" class="form-control"></select>
                                    <span class="input-group-addon"><a href="#" id="newSupplierInvoice"><i class="fa fa-plus"></i></a></span>
                                </div>
                                <span class="inputError" id="supplierError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4 hide" id="shipperSection">
                            <label for="shipper" class="col-xs-4 control-label">Otro</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="shipper" name="shipper" class="form-control" aria-describedby="shipper" autocomplete="none"/>
                                <span class="inputError" id="shipperError"></span>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <label for="nif" class="col-xs-4 control-label">NIF</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="nif" name="nif" class="form-control autocompleteNif" aria-describedby="nif" autocomplete="none" disabled />
                                <span class="inputError" id="nifError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div id="createIvasBreakdown">
                        <div id="ivaBreakdown0" item="0" class="row form-group iva-breakdown-item">
                            <div class="col-xs-4">
                                <label for="taxBase0" class="col-xs-5 control-label">Base imponible 1</label>
                                <div class="input-group" style="padding-left: 3%;">
                                    <input type="number" min="0" value="0" id="taxBase0" name="taxBase0" class="form-control" style="width: 120px !important;" onchange="calculateTotalInvoice('#modal-new-received-invoice', '#createIvasBreakdown')" item="0" aria-describedby="base imponible" autocomplete="none"/>
                                    <div class="input-group-addon">€</div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="feeHoldIva0" class="col-xs-9 control-label">Cuota de <?= $ivaLabel ?> retenido 1</label>
                                <div class="col-xs-3">
                                    <select class="form-control iva" id="feeHoldIva0" onchange="calculateTotalInvoice('#modal-new-received-invoice', '#createIvasBreakdown')" item="0"></select>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="totalIva0" class="col-xs-12 control-label" style="text-align:center">Total <?= $ivaLabel ?> 1: <strong><span id="totalIva0">0.00 €</span></strong></label>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="withholding" class="col-xs-5 control-label">Retención</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="withholding" name="withholding" onchange="calculateTotalInvoice('#modal-new-received-invoice', '#createIvasBreakdown')" class="form-control" style="width: 120px !important;" aria-describedby="retención" autocomplete="none"/>
                                <div class="input-group-addon">%</div>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label for="supplied" class="col-xs-2 control-label">Suplido</label>
                            <div class="input-group" style="padding-left: 5%;">
                                <input type="number" min="0" value="0" id="supplied" name="supplied" onchange="calculateTotalInvoice('#modal-new-received-invoice', '#createIvasBreakdown')" class="form-control" style="width: 120px !important;" aria-describedby="suplido" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                        <div class="col-xs-2">
                        </div>
                        <div class="col-xs-2 iva-actions-sections">
                            <button type="button" class="btn btn-primary" onclick="addIvaBreakdown('#modal-new-received-invoice', '#createIvasBreakdown')">
                                <i class="fa fa-plus" aria-hidden="true"></i> AÑADIR <?= $ivaLabel ?>
                            </button>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="total" class="col-xs-5 control-label">Total</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="total" name="total" class="form-control" style="width: 120px !important;" aria-describedby="total" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="paymentMethod" class="col-xs-4 control-label">Forma de pago</label>
                            <div class="col-xs-8">
                                <select id="paymentMethod" name="paymentMethod" class="form-control">
                                    <option value="1">Contado</option>
                                    <option value="2">Transferencia bancaria</option>
                                    <option value="3">Cargo en cuenta</option>
                                    <option value="4">Tarjeta de crédito</option>
                                </select>
                            </div>
                        </div>
                        <div class="hide" id="bankAccounts">
                            <div class="col-xs-6">
                                <label for="bankAccount" class="col-xs-4 control-label">Cuenta bancaria</label>
                                <div class="col-xs-8">
                                    <select id="bankAccount" name="bankAccount" class="form-control"></select>
                                    <br><span class="inputError" id="bankAccountError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hide" id="creditCards">
                            <div class="col-xs-6">
                                <label for="creditCard" class="col-xs-4 control-label">Tarjeta de crédito/débito</label>
                                <div class="col-xs-8">
                                    <select id="creditCard" name="creditCard" class="form-control"></select>
                                    <br><span class="inputError" id="creditCardError"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="cashOut" class="col-xs-4 control-label">Tipo de salida</label>
                            <div class="col-xs-8">
                                <select id="cashOut" name="cashOut" class="form-control">
                                    <option value="0">--</option>
                                    <option value="1">Gasto</option>
                                    <option value="2">Inversión</option>
                                </select>
                            </div>
                        </div>
                        <div class="hide" id="expenses">
                            <div class="col-xs-6">
                                <label for="expenseType" class="col-xs-4 control-label">Tipo de gasto</label>
                                <div class="col-xs-8">
                                    <select id="expenseType" name="expenseType" class="form-control">
                                        <option value="0">--</option>
                                        <option value="1">Fijo</option>
                                        <option value="2">Variable</option>
                                    </select>
                                    <span class="inputError" id="expenseTypeError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hide" id="expensesFixed">
                            <div class="col-xs-6">
                                <label for="expenseFixed" class="col-xs-4 control-label">Gastos fijos</label>
                                <div class="col-xs-8">
                                    <select id="expenseFixed" name="expenseFixed" class="form-control"></select>
                                    <span class="inputError" id="expenseFixedError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hide" id="expensesVariable">
                            <div class="col-xs-6">
                                <label for="expenseVariable" class="col-xs-4 control-label">Gastos variables</label>
                                <div class="col-xs-8">
                                    <select id="expenseVariable" name="expenseVariable" class="form-control"></select>
                                    <span class="inputError" id="expenseVariableError"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="costCenter" class="col-xs-4 control-label">Centros de coste</label>
                            <div class="col-xs-8">
                                <select id="costCenter" name="costCenter" class="form-control"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6 hide" id="costOtherDiv">
                            <label for="costCenter" class="col-xs-4 control-label">Otros</label>
                            <div class="col-xs-8">
                                <input type="text" size="20" id="otherCostcenter" name="otherCostcenter" class="form-control" aria-describedby="total" autocomplete="none"/>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="concept" class="col-xs-4 control-label">Concepto</label>
                            <div class="col-xs-8">
                                <textarea class="form-control" name="concept" id="concept" rows="5" cols="110"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="comments" class="col-xs-4 control-label">Comentarios</label>
                            <div class="col-xs-8">
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="110"></textarea>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-5">
                            <label for="concept" class="col-xs-5 control-label">Periodicidad</label>
                            <div class="col-xs-7">
                                <select id="regularity" class="form-control">
                                    <option value="0">-</option>
                                    <option value="1">Cada mes</option>
                                    <option value="2">Cada 2 meses</option>
                                    <option value="3">Cada 3 meses</option>
                                    <option value="4">Cada 4 meses</option>
                                    <option value="6">Cada 6 meses</option>
                                    <option value="12">Cada año</option>
                                    <option value="24">Cada 2 años</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-6">
                            <div class="col-xs-4" style="margin-top:1%">
                                <label>Adjuntar archivos</label>
                            </div>
                            <div class="col-xs-8">
                                <input type="file" style="border:0; margin-left:-10%;" class="form-control" name="fileAttachDocMultiple" id="fileAttachDocMultiple" accept=".pdf" multiple>
                            </div>
                        </div>
                    </div> 
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-12">
                            <div id="fileAttachDocMultipleSection" style="margin-left:2%"></div>
                        </div>
                    </div> 
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewReceivedInvoice" name="saveNewReceivedInvoice" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-received-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Factura recibida</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditReceivedInvoice" name="formEditReceivedInvoice">
                    <input type="hidden" id="ID">
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="invoiceNumber" class="col-xs-4 control-label">Nº Factura</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="invoiceNumber" name="invoiceNumber" class="form-control" aria-describedby="invoiceNumber" autocomplete="none"/>
                                <span class="inputError" id="invoiceNumberError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="isTicket" name="isTicket"> Ticket
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="date" class="col-xs-5 control-label">Fecha de expedición</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="date" name="date" aria-describedby="fecha" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDate" class="col-xs-5 control-label">Fecha de pago</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="paymentDate" name="paymentDate" aria-describedby="fecha de pago" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="paymentDateError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate" class="col-xs-5 control-label">Fecha vencimiento a 30 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate" name="dueDate" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate" class="col-xs-5 control-label">Pago vencimiento a 30 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate" name="paymentDueDate" class="form-control" aria-describedby="paymentDueDate" />
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate2" class="col-xs-5 control-label">Fecha vencimiento a 60 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate2" name="dueDate2" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDate2Error"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate2" class="col-xs-5 control-label">Pago vencimiento a 60 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate2" name="paymentDueDate2" class="form-control" aria-describedby="paymentDueDate2" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate3" class="col-xs-5 control-label">Fecha vencimiento a 90 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate3" name="dueDate3" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDate3Error"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate3" class="col-xs-5 control-label">Pago vencimiento a 90 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate3" name="paymentDueDate3" class="form-control" aria-describedby="paymentDueDate3" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="supplier" class="col-xs-4 control-label">Expedidor</label>
                            <div class="col-xs-8">
                                <div class="input-group">
                                    <select size="20" id="supplier" name="supplier" class="form-control"></select>
                                </div>
                                <span class="inputError" id="supplierError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4 hide" id="shipperSection">
                            <label for="shipper" class="col-xs-4 control-label">Otro</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="shipper" name="shipper" class="form-control" aria-describedby="shipper" autocomplete="none"/>
                                <span class="inputError" id="shipperError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label for="nif" class="col-xs-4 control-label">NIF</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="nif" name="nif" class="form-control autocompleteNif" aria-describedby="nif" autocomplete="none" disabled />
                                <span class="inputError" id="nifError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div id="editIvasBreakdown">
                        <div id="ivaBreakdown0" item="0" class="row form-group iva-breakdown-item">
                            <input type="hidden" id="receivedIvaId0">
                            <div class="col-xs-4">
                                <label for="taxBase0" class="col-xs-5 control-label">Base imponible 1</label>
                                <div class="input-group" style="padding-left: 3%;">
                                    <input type="number" min="0" value="0" id="taxBase0" name="taxBase0" class="form-control" style="width: 120px !important;" onchange="calculateTotalInvoice('#modal-edit-received-invoice', '#editIvasBreakdown')" item="0" aria-describedby="base imponible" autocomplete="none"/>
                                    <div class="input-group-addon">€</div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="feeHoldIva0" class="col-xs-9 control-label">Cuota de <?= $ivaLabel ?> retenido 1</label>
                                <div class="col-xs-3">
                                    <select class="form-control iva" id="feeHoldIva0" onchange="calculateTotalInvoice('#modal-edit-received-invoice', '#editIvasBreakdown')" item="0"></select>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="totalIva0" class="col-xs-12 control-label" style="text-align:center">Total <?= $ivaLabel ?> 1: <strong><span id="totalIva0">0.00 €</span></strong></label>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="withholding" class="col-xs-5 control-label">Retención</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="withholding" name="withholding" onchange="calculateTotalInvoice('#modal-edit-received-invoice', '#editIvasBreakdown')" class="form-control" style="width: 120px !important;" aria-describedby="retención" autocomplete="none"/>
                                <div class="input-group-addon">%</div>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label for="supplied" class="col-xs-2 control-label">Suplido</label>
                            <div class="input-group" style="padding-left: 5%;">
                                <input type="number" min="0" value="0" id="supplied" name="supplied" onchange="calculateTotalInvoice('#modal-edit-received-invoice', '#editIvasBreakdown')" class="form-control" style="width: 120px !important;" aria-describedby="suplido" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                        <div class="col-xs-2">
                        </div>
                        <div class="col-xs-2 iva-actions-sections">
                            <button type="button" class="btn btn-primary" onclick="addIvaBreakdown('#modal-edit-received-invoice', '#editIvasBreakdown')">
                                <i class="fa fa-plus" aria-hidden="true"></i> AÑADIR <?= $ivaLabel ?>
                            </button>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="total" class="col-xs-5 control-label">Total</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="total" name="total" class="form-control" style="width: 120px !important;" aria-describedby="total" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="paymentMethod" class="col-xs-4 control-label">Forma de pago</label>
                            <div class="col-xs-8">
                                <select id="paymentMethod" name="paymentMethod" class="form-control">
                                    <option value="1">Contado</option>
                                    <option value="2">Transferencia bancaria</option>
                                    <option value="3">Cargo en cuenta</option>
                                    <option value="4">Tarjeta de crédito</option>
                                </select>
                            </div>
                        </div>
                        <div class="hide" id="bankAccounts">
                            <div class="col-xs-6">
                                <label for="bankAccount" class="col-xs-4 control-label">Cuenta bancaria</label>
                                <div class="col-xs-8">
                                    <select id="bankAccount" name="bankAccount" class="form-control"></select>
                                    <br><span class="inputError" id="bankAccountError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hide" id="creditCards">
                            <div class="col-xs-6">
                                <label for="creditCard" class="col-xs-4 control-label">Tarjeta de crédito/débito</label>
                                <div class="col-xs-8">
                                    <select id="creditCard" name="creditCard" class="form-control"></select>
                                    <br><span class="inputError" id="creditCardError"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="cashOut" class="col-xs-4 control-label">Tipo de salida</label>
                            <div class="col-xs-8">
                                <select id="cashOut" name="cashOut" class="form-control">
                                    <option value="0">--</option>
                                    <option value="1">Gasto</option>
                                    <option value="2">Inversión</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="hide" id="expenses">
                            <div class="col-xs-6">
                                <label for="expenseType" class="col-xs-4 control-label">Tipo de gasto</label>
                                <div class="col-xs-8">
                                    <select id="expenseType" name="expenseType" class="form-control">
                                        <option value="0">--</option>
                                        <option value="1">Fijo</option>
                                        <option value="2">Variable</option>
                                    </select>
                                    <span class="inputError" id="expenseTypeError"></span>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="hide" id="expensesFixed">
                            <div class="col-xs-6">
                                <label for="expenseFixed" class="col-xs-4 control-label">Gastos fijos</label>
                                <div class="col-xs-8">
                                    <select id="expenseFixed" name="expenseFixed" class="form-control"></select>
                                    <span class="inputError" id="expenseFixedError"></span>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="hide" id="expensesVariable">
                            <div class="col-xs-6">
                                <label for="expenseVariable" class="col-xs-4 control-label">Gastos variables</label>
                                <div class="col-xs-8">
                                    <select id="expenseVariable" name="expenseVariable" class="form-control"></select>
                                    <span class="inputError" id="expenseVariableError"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="costCenter" class="col-xs-4 control-label">Centros de coste</label>
                            <div class="col-xs-8">
                                <select id="costCenter" name="costCenter" class="form-control"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6 hide" id="costOtherDiv">
                            <label for="costCenter" class="col-xs-4 control-label">Otros</label>
                            <div class="col-xs-8">
                                <input type="text" size="20" id="otherCostcenter" name="otherCostcenter" class="form-control" aria-describedby="total" autocomplete="none"/>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="concept" class="col-xs-4 control-label">Concepto</label>
                            <div class="col-xs-8">
                                <textarea class="form-control" name="concept" id="concept" rows="5" cols="110" autocomplete="none"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="comments" class="col-xs-4 control-label">Comentarios</label>
                            <div class="col-xs-8">
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="110" autocomplete="none"></textarea>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-5">
                            <label for="concept" class="col-xs-5 control-label">Periodicidad</label>
                            <div class="col-xs-7">
                                <select id="regularity" class="form-control">
                                    <option value="0">-</option>
                                    <option value="1">Cada mes</option>
                                    <option value="2">Cada 2 meses</option>
                                    <option value="3">Cada 3 meses</option>
                                    <option value="4">Cada 4 meses</option>
                                    <option value="6">Cada 6 meses</option>
                                    <option value="12">Cada año</option>
                                    <option value="24">Cada 2 años</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-6">
                            <div class="col-xs-4" style="margin-top:1%">
                                <label>Adjuntar archivo</label>
                            </div>
                            <div class="col-xs-8">
                                <input type="file" style="border:0; margin-left:-10%;" class="form-control" name="fileAttachDocMultiple" id="fileAttachDocMultiple" accept=".pdf" multiple>
                            </div>
                        </div>
                    </div> 
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-12">
                            <div id="fileAttachDocMultipleSection" style="margin-left:2%"></div>
                        </div>
                    </div> 
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditReceivedInvoice" name="saveEditReceivedInvoice" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-payments" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="titleInvoice" class="modal-title">Pagos de la factura <span id="paymentListInvoiceTitle"></span></h4>
            </div>
            <div class="modal-body">
                <div id="warning-message"></div>
                <div class="text-center">
                    <p id="message"><span id="paymentsSection" class="bold"></span></p>
                </div>
                <div id="divSummary" class="row form-group" style="margin-top:10px">
                    <div class="col-xs-4">
                        <label for="totalInvoice" class="col-xs-4 control-label">Total</label>
                        <div class="col-xs-4">
                            <input type="text" size="10" id="totalInvoice" name="totalInvoice" class="form-control" aria-describedby="totalInvoice" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <label for="totalPaid" class="col-xs-4 control-label">Pagado</label>
                        <div class="col-xs-4">
                            <input type="text" size="10" id="totalPaid" name="totalPaid" class="form-control" aria-describedby="totalPaid" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <label for="amountPending" class="col-xs-4 control-label">Pendiente</label>
                        <div class="col-xs-4">
                            <input type="text" size="10" id="amountPending" name="amountPending" class="form-control" aria-describedby="amountPending" autocomplete="none" disabled>
                        </div>
                    </div>
                </div>
                <div class="table-responsive" id="paymentsTable">
                    <table class="table table-striped table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                        <thead>
                            <th class="hide">#</th>
                            <th class="text-center">Fecha de Pago</th>
                            <th class="text-center" >Cantidad</th>
                            <th class="text-center">Editar</th>
                            <th class="text-center">Eliminar</th>
                        </thead>
                        <tbody id="paymentsBody"></tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-supplier-invoices" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Proveedor</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewSuppInvoices" name="formNewSuppInvoices" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="name" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="36" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-4 control-label">CIF</label>
                        <div class="col-xs-4">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" style="display: inline-block;" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                        <div class="col-xs-2" style="margin-left:3%">
                            <input type="checkbox" class="minimal" id="validateCIF" name="validateCIF" checked> Validar
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-4 control-label">Dirección</label>
                        <div class="col-xs-8">
                            <input type="text" size="36" class="form-control" id="address" name="address" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-4 control-label">E-mail</label>
                        <div class="col-xs-8">
                            <input type="email" size="36" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-4 control-label">Provincia</label>
                        <div class="col-xs-8">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-4 control-label">Localidad</label>
                        <div class="col-xs-8">
                            <select id="location" name="location" class="form-control location select2"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Teléfonos</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="36" class="form-control phone" id="phone" name="phone" autocomplete="none">
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
                        <label for="fax" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="36" class="form-control" id="fax" name="fax" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Persona de Contacto</label>
                        <div class="col-xs-8">
                            <div class="input-group input-contactPeople">
                                <input type="text" size="15" class="form-control" id="person" name="person" placeholder="Nombre" autocomplete="none">
                                <input type="text" size="15" class="form-control" id="department" name="department" placeholder="Departamento" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-person" title="Nueva Persona de Contacto">
                                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="contactPeople"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-4 control-label"><span  data-placement="top" title="Productos, marcas...">Descripción</span></label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="3" cols="40" id="description" name="description" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Catálogo</label>
                        <div class="col-xs-8">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el proveedor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-xs-4 control-label">Fecha de Entrada</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="36" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewSupplier" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-supplier-edit-invoices" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Proveedor</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewSuppEditInvoices" name="formNewSuppEditInvoices" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="name" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="36" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-4 control-label">CIF</label>
                        <div class="col-xs-4">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" style="display: inline-block;" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                        <div class="col-xs-2" style="margin-left:3%">
                            <input type="checkbox" class="minimal" id="validateEditCIF" name="validateEditCIF" checked> Validar
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-4 control-label">Dirección</label>
                        <div class="col-xs-8">
                            <input type="text" size="36" class="form-control" id="address" name="address" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-4 control-label">E-mail</label>
                        <div class="col-xs-8">
                            <input type="email" size="36" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-4 control-label">Provincia</label>
                        <div class="col-xs-8">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-4 control-label">Localidad</label>
                        <div class="col-xs-8">
                            <select id="location" name="location" class="form-control location select2"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Teléfonos</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="36" class="form-control phone" id="phone" name="phone" autocomplete="none">
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
                        <label for="fax" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="36" class="form-control" id="fax" name="fax" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Persona de Contacto</label>
                        <div class="col-xs-8">
                            <div class="input-group input-contactPeople">
                                <input type="text" size="15" class="form-control" id="person" name="person" placeholder="Nombre" autocomplete="none">
                                <input type="text" size="15" class="form-control" id="department" name="department" placeholder="Departamento" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-person" title="Nueva Persona de Contacto">
                                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="contactPeople"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-4 control-label"><span  data-placement="top" title="Productos, marcas...">Descripción</span></label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="3" cols="40" id="description" name="description" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Catálogo</label>
                        <div class="col-xs-8">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el proveedor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-xs-4 control-label">Fecha de Entrada</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="36" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewSupplier" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-received-invoice-delivery" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Factura recibida</span></h4>
            </div>
            <div class="modal-body">
                <form id="formReceivedInvoiceDelivery" name="formReceivedInvoiceDelivery">
                    <div class="row form-group">
                        <div style="margin-top: 1%" class="col-xs-4">
                            <div class="col-xs-8">
                                <input type="hidden" size="12" id="id" name="id" class="form-control" aria-describedby="id" />
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div  class="col-xs-3">
                            <label for="invoiceNumber" class="col-xs-5 control-label">Nº Factura</label>
                            <div class="col-xs-6">
                                <input type="text" size="12" id="invoiceNumber" name="invoiceNumber" class="form-control" aria-describedby="invoiceNumber" autocomplete="none"/>
                                <span class="inputError" id="invoiceNumberError"></span>
                            </div>
                        </div>
                        <div class="col-xs-5" style="padding-left: 5%;">
                            <label for="date" class="col-xs-5 control-label">Fecha de expedición</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="date" name="date" aria-describedby="fecha" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label for="paymentDate" class="col-xs-5 control-label">Fecha de pago</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="paymentDate" name="paymentDate" aria-describedby="fecha de pago" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="paymentDateError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate" class="col-xs-5 control-label">Fecha vencimiento a 30 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate" name="dueDate" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate" class="col-xs-5 control-label">Pago vencimiento a 30 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate" name="paymentDueDate" class="form-control" aria-describedby="paymentDueDate" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate2" class="col-xs-5 control-label">Fecha vencimiento a 60 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate2" name="dueDate2" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDate2Error"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate2" class="col-xs-5 control-label">Pago vencimiento a 60 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate2" name="paymentDueDate2" class="form-control" aria-describedby="paymentDueDate2" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate3" class="col-xs-5 control-label">Fecha vencimiento a 90 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate3" name="dueDate3" aria-describedby="fecha de vencimiento" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dueDate3Error"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDueDate3" class="col-xs-5 control-label">Pago vencimiento a 90 días</label>
                            <div class="input-group" style="padding-left: 3%;">
                                <input type="number" min="0" value="0" id="paymentDueDate3" name="paymentDueDate3" class="form-control" aria-describedby="paymentDueDate3" autocomplete="none"/>
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div style="margin-top: 3%" class="row form-group">

                        <div class="col-xs-4">
                            <label for="supplier" class="col-xs-4 control-label">Expedidor</label>
                            <div class="col-xs-8">
                                <div class="input-group">
                                    <input type="text" size="25" id="supplier" name="supplier" class="form-control" aria-describedby="supplier" autocomplete="none" disabled/>
                                </div>
                                <span class="inputError" id="supplierError"></span>
                            </div>
                        </div>
                        
                        <div class="col-xs-4">
                            <label for="nif" class="col-xs-1 control-label">NIF</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="nif" name="nif" class="form-control autocompleteNif" aria-describedby="nif" autocomplete="none" disabled />
                                <span class="inputError" id="nifError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <fieldset>
                        <legend>
                            <span class="label label-primary labelLgExp"> Línas de albarán</span>
                        </legend>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="clearfix table-responsive">
                                    <table id="lines" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                                        <thead id="linesTable">
                                            <tr>
                                                <th class="text-center">Núm.</th>
                                                <th class="text-center">Producto</th>
                                                <th class="text-center">Modelo</th>
                                                <th class="text-center">Precio</th>
                                                <th class="text-center">Cantidad</th>
                                                <th class="text-center">Base Imponible</th>
                                                <th class="text-center">Descuento</th>
                                                <th class="text-center">Cuota de <?= $ivaLabel ?></th>
                                                <th class="text-center">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody id="deliveryLines"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <hr>
                    <br>
                    <div class="row form-group">
                        <div class="col-xs-4">
                            <label for="paymentMethod" class="col-xs-4 control-label">Forma de pago</label>
                            <div class="col-xs-8">
                                <select id="paymentMethod" name="paymentMethod" class="form-control">
                                    <option value="1">Contado</option>
                                    <option value="2">Transferencia bancaria</option>
                                    <option value="3">Cargo en cuenta</option>
                                    <option value="4">Tarjeta de crédito</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-xs-4">
                            <label for="costCenter" class="col-xs-4 control-label">Centros de coste</label>
                            <div class="col-xs-8">
                                <select id="costCenter" name="costCenter" class="form-control"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>

                        <div class="col-xs-2">
                            <label for="total" class="col-xs-4 control-label">Total</label>
                            <div class="col-xs-8">
                                <input type="text" size="10" id="total" name="total" class="form-control" aria-describedby="total" autocomplete="none" disabled/>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="hide" id="bankAccounts">
                            <div class="col-xs-4">
                                <label for="bankAccount" class="col-xs-4 control-label">Cuenta bancaria</label>
                                <div class="col-xs-8">
                                    <select id="bankAccount" name="bankAccount" class="form-control"></select>
                                    <span class="inputError" id="bankAccountError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hide" id="creditCards">
                            <div class="col-xs-4">
                                <label for="creditCard" class="col-xs-4 control-label">Tarjeta de crédito/débito</label>
                                <div class="col-xs-8">
                                    <select id="creditCard" name="creditCard" class="form-control"></select>
                                    <span class="inputError" id="creditCardError"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="comments" class="col-xs-4 control-label">Comentarios</label>
                            <div class="col-xs-8">
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="110" autocomplete="none"></textarea>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-12">
                            <div class="col-xs-2">
                                <label>Adjuntar archivo</label>
                            </div>
                            <div class="col-xs-4">
                                <input type="file" style="border:0; margin-left:-10%" class="form-control" name="fileAttachDocEditDelivery" id="fileAttachDocEditDelivery" accept=".pdf">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditReceivedInvoiceDelivery" name="saveEditReceivedInvoiceDelivery" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>