<div class="modal fade" id="modal-invoices-pay" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Pagar factura<span id="payInvoiceTitle"></span></h4>
            </div>           
            <div class="modal-body">
                <form id="formEditInvoice" class="form-horizontal">
                    <div class="row form-group" style="margin-top:10px">
                        <div class="col-xs-6">
                            <label for="totalInvoice" class="col-xs-4 control-label">Total Factura</label>
                            <div class="col-xs-8">
                                <input type="text" id="totalInvoice" name="totalInvoice" class="form-control" aria-describedby="totalInvoice" autocomplete="none" disabled>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="totalPaid" class="col-xs-4 control-label">Total Pagado</label>
                            <div class="col-xs-8">
                                <input type="text" id="totalPaid" name="totalPaid" class="form-control" aria-describedby="totalPaid" autocomplete="none" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label for="amount" class="col-xs-4 control-label">Cantidad</label>
                                <div class="col-xs-8">
                                    <input type="hidden" id="ID-invoice">
                                    <input type="number" min="0" value="0" id="amount" name="amount" class="form-control" aria-describedby="amount" autocomplete="none"/>
                                    <span class="inputError" id="amountError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="amount" class="col-xs-5 control-label">Fecha de Pago</label>
                            <div class="input-group date">
                                <input type="text" size="13" class="form-control datepicker" id="date" name="date" aria-describedby="fecha" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateError"></span>
                        </div>
                    </div>                
                </form>                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="savePayments" name="savePayments" type="button" class="btn btn-primary"><i class="fa fa-credit-card-alt" aria-hidden="true"></i> Pagar</button>
            </div> 
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="confirm-paid-invoice-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso de <span class="bolder">sobrepago</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p id="message">La cantidad que quiere pagar <strong>supera</strong> el total de la factura</p>
                    <p id="message"><strong>¿Desea continuar?</strong></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button  id="confirmBtn"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Confirmar</button>
            </div>
        </div>
    </div>
</div>



