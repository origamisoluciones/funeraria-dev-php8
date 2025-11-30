<div class="modal fade" id="modal-new-billing-serie" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">serie de facturación</span></h4>
            </div>
            <div class="modal-body">
                <div id="warning-message"></div>
                <form class="form-horizontal" id="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="letter" class="col-xs-3 control-label">Letra</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="letter" autocomplete="none">
                            <span class="inputError" id="letterError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="expedientsTypeCreate" class="col-xs-3 control-label">Tipos de expedientes</label>
                        <div class="col-xs-9">
                            <select id="expedientsTypeCreate" name="expedientsTypeCreate" class="form-control expedients-types"></select>
                            <div>
                                <span class="inputError" id="expedientsTypeCreateError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewBillingSerie" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-billing-serie" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">serie de facturación</span></h4>
            </div>
            <div class="modal-body">
                <div id="warning-message"></div>
                <form class="form-horizontal" id="formEditData">
                    <input type="hidden" id="id">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="letter" class="col-xs-3 control-label">Letra</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="letter" autocomplete="none" readonly>
                            <span class="inputError" id="letterError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="expedientsTypeEdit" class="col-xs-3 control-label">Tipos de expedientes</label>
                        <div class="col-xs-9">
                            <select id="expedientsTypeEdit" name="expedientsTypeEdit" class="form-control expedients-types"></select>
                            <div>
                                <span class="inputError" id="expedientsTypeEditError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditBillingSerie" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>