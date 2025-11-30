<div class="modal fade" id="modal-edit-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Cobrar factura <span class="bolder" id="generatedInvoiceNumber"></span></h4>
            </div>
            <div class="modal-body">
                <form id="formEditInvoice" class="form-horizontal">
                    <input type="hidden" id="expedient">
                    <input type="hidden" id="invoiceID">
                    <div class="form-group">
                        <label for="expedientNumber" class="col-xs-4 control-label">Expediente asociado:</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="expedientNumber" name="expedientNumber" disabled>                            
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="paymentMethod" class="col-xs-4 control-label">Método de cobro:</label>
                        <div class="col-xs-8">
                            <select class="form-control" id="paymentMethod">
                                <option value="" selected>--</option>
                                <option value="Contado">Contado</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Giro bancario">Giro bancario</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                            <span class="inputError" id="paymentMethodError"></span>
                        </div>
                    </div>
                    <div id="accountNumberSection" class="form-group">
                        <label for="accountNumber" id="accountNumberLabel" class="col-xs-4 control-label">Nº Cuenta:</label>
                        <div class="col-xs-8">
                            <select class="form-control select2" id="accountNumber" name="accountNumber"></select>
                            <span class="inputError" id="accountNumberError"></span>
                        </div>
                    </div>
                    <div id="tpvNumAccountNumberSection" class="form-group hide">
                        <label for="tpvNumAccountNumber" class="col-xs-4 control-label">Nº Cuenta (TPV):</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="tpvNumAccountNumber" name="tpvNumAccountNumber" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Fecha de cobro</label>
                        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                              <div class="input-group date">
                                <input type="text" class="form-control datepicker" id="date" name="date" autocomplete="off">
                                <div class="input-group-addon">
                                  <i class="fa fa-calendar"></i>
                                </div>
                              </div>
                            </div>
                            <span class="inputError" id="dateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber" class="col-xs-4 control-label">Total: </label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="total" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber" class="col-xs-4 control-label">Cobrado:</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="paied" name="paied" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber" class="col-xs-4 control-label">A cobrar:</label>
                        <div class="col-xs-8">
                            <input type="number" min="1" size="30" class="form-control" id="pay" name="pay" value="0">
                            <span class="inputError" id="payError"></span>
                        </div>
                    </div>
                    <div class="form-group hide">
                        <label for="accountNumber" class="col-xs-4 control-label">Estado:</label>
                        <div class="col-xs-8">
                            <select id="paymentState" name="paymentState" class="form-control select2">
                                <option></option>
                                <option value="0" selected>Pendiente</option>
                                <option value="1">Pagada</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="comments" class="col-xs-4 control-label">Comentarios:</label>
                        <div class="col-xs-8">
                            <textarea class="form-control" id="comments" name="comments" rows="5" cols="45"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Adjuntar archivos</label>
                        <div class="col-xs-1">
                            <input type="file" style="border:0; margin-left:-10%;" class="form-control" name="fileAttachDocMultiple" id="fileAttachDocMultiple" accept=".pdf" multiple>
                        </div>
                    </div> 
                    <div class="form-group">
                        <div class="col-xs-12">
                            <div id="fileAttachDocMultipleSection" style="margin-left:15%"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="saveInvoice"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Cobrar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-invoices-history" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Histórico <span class="bolder">de facturas</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="oID">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Facturas</span></legend>
                    <br>
                
                <div class="clearfix table-responsive">
                    <table id="listInvoices" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Número</th>
                                <th>Estado</th>
                                <th>Fecha factura</th>
                                <th>Fecha emisión</th>
                                <th>Usuario emisión</th>
                                <th>Acciones</th>                        
                            </tr>
                        </thead>
                        <tbody id="tableBodyInvoices"></tbody>
                    </table>
                </div>
            </div>
            </fieldset>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>