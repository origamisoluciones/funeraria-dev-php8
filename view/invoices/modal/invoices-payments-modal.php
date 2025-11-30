<div class="modal fade" id="modal-payments" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="titleInvoice" class="modal-title">Pagos de la factura <span id="paymentListInvoiceTitle"></span></h4>
            </div>
            <div class="modal-body">
                <div id="warning-message"></div>
                <div class="text-center">
                    <p id="message"></p>
                </div>
                <div id="divSummary" class="row form-group" style="margin-top:10px">
                    <div class="col-xs-2">
                        <label for="totalInvoice" class="col-xs-4 control-label">Total</label>
                        <div class="col-xs-4">
                            <input type="text" size="10" id="totalInvoice" name="totalInvoice" class="form-control" aria-describedby="totalInvoice" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="col-xs-2">
                        <label for="totalPaid" class="col-xs-4 control-label">Pagado</label>
                        <div class="col-xs-4">
                            <input type="text" size="10" id="totalPaid" name="totalPaid" class="form-control" aria-describedby="totalPaid" autocomplete="none" disabled>
                        </div>
                    </div>
                    <div class="col-xs-3">
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
                            <th class="text-center">Cantidad</th>
                            <th class="text-center">Descargar adjuntos</th>
                            <th class="text-center">Editar adjuntos</th>
                            <th class="text-center">Guardar</th>
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

<div class="modal fade" id="modal-payments-docs" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Documentos adjuntos al cobro de la factura <span id="titleModal" class="bolder"></span></h4>
            </div>
            <div class="modal-body">
                <form id="formPaymentsDocs" name="formPaymentsDocs">
                    <input type="hidden" id="invoiceID">
                    <input type="hidden" id="paymentID">
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-6">
                            <div class="col-xs-6" style="margin-top:1%">
                                <label>Adjuntar archivos</label>
                            </div>
                            <div class="col-xs-6">
                                <input type="file" style="border:0; margin-left:-10%;" class="form-control" name="fileAttachDocMultiple" id="fileAttachDocMultiple" accept=".pdf" multiple>
                            </div>
                        </div>
                    </div>
                    <hr>
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
                <button id="savePaymentsDocs" name="savePaymentsDocs" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>