<div class="modal fade" id="modal-new-received-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Factura recibida</span></h4>
            </div>
            <div class="modal-body">
                <form id="formNewReceivedInvoice" name="formNewReceivedInvoice">
                <div class="row form-group">
                        <div  class="col-xs-3">
                            <label for="invoiceNumber" class="col-xs-5 control-label">Nº Factura</label>
                            <div class="col-xs-6">
                                <input type="text" size="12" id="invoiceNumber" name="invoiceNumber" class="form-control" aria-describedby="invoiceNumber" />
                                <span class="inputError" id="invoiceNumberError"></span>
                            </div>
                        </div>
                        <div class="col-xs-5" style="padding-left: 5%;">
                            <label for="date" class="col-xs-5 control-label">Fecha de expedición</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="date" name="date" aria-describedby="fecha">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4" style="margin-left: -4%;">
                            <label for="paymentDate" class="col-xs-5 control-label">Fecha de pago</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="paymentDate" name="paymentDate" aria-describedby="fecha de pago">
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
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate" name="dueDate" aria-describedby="fecha de vencimiento">
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
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate2" name="dueDate2" aria-describedby="fecha de vencimiento">
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
                                <input type="number" min="0" value="0" id="paymentDueDate2" name="paymentDueDate2" class="form-control" aria-describedby="paymentDueDate2" />
                                <div class="input-group-addon">€</div>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="dueDate3" class="col-xs-5 control-label">Fecha vencimiento a 90 días</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="12" class="form-control datepicker" id="dueDate3" name="dueDate3" aria-describedby="fecha de vencimiento">
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
                                <input type="number" min="0" value="0" id="paymentDueDate3" name="paymentDueDate3" class="form-control" aria-describedby="paymentDueDate3" />
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
                                    <select size="20" id="supplier" name="supplier" class="form-control"></select>
                                    <span class="input-group-addon"><a href="#" id="newSupplierInvoice"><i class="fa fa-plus"></i></a></span>
                                </div>
                                <span class="inputError" id="supplierError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4 hide" id="shipperSection">
                            <label for="shipper" class="col-xs-4 control-label">Otro</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="shipper" name="shipper" class="form-control" aria-describedby="shipper" />
                                <span class="inputError" id="shipperError"></span>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label for="nif" class="col-xs-4 control-label">NIF</label>
                            <div class="col-xs-8">
                                <input type="text" size="12" id="nif" name="nif" class="form-control autocompleteNif" aria-describedby="nif" disabled />
                                <span class="inputError" id="nifError"></span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <fieldset>
                        <legend>
                            <span class="label label-primary labelLgExp"> Línas de albarán</span>
                        </legend>
                        <br>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="clearfix table-responsive">
                                    <table id="lines" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                                        <thead id="deliveryLinesTable">
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
                    
                    <div style="margin-top: 3%" class="row form-group">
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
                        <div class="col-xs-4">
                            <label for="totalDeliveryNote" class="col-xs-4 control-label">Total</label>
                            <div class="col-xs-8">
                                <input type="text" id="totalDeliveryNote" name="totalDeliveryNote" class="form-control" aria-describedby="total" />
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
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="110"></textarea>
                            </div>
                        </div>
                    </div>
                    <hr>
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

