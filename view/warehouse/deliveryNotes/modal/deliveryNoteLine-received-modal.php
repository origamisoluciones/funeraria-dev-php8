<div class="modal fade" id="modal-pending-deliveryNoteLine" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Recepción del producto</h4>
            </div>
            <div class="modal-body">
                <div class="table-responsive">
                    <table class="table table table-striped table-bordered" id="pending" width="100%" cellspacing="0">
                        <thead>
                            <th width="5%" class="hide">index</th>
                            <th width="5%" class="hide">idPending</th>
                            <th width="20%">Fecha</th>
                            <th width="20%">Cantidad recibida</th>
                        </thead>
                        <tbody id="linesPending"></tbody>
                    </table>
                    <button id="newDatePending">Añadir fecha</button>
                    <input type="hidden" id="deliveryNoteLineID">
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="savePendingDeliveryNoteLine" name="savePendingDeliveryNoteLine" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>