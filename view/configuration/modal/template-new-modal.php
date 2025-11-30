<div class="modal fade" id="modal-new-template" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Plantilla</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Plantilla</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="client" class="col-xs-3 control-label">Tipo cliente</label>
                        <div class="col-xs-9">
                            <select id="client" name="client" class="form-control infinitySelect client"></select>
                            <span class="inputError" id="clientError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="price" class="col-xs-3 control-label">Tarifa</label>
                        <div class="col-xs-9">
                            <select id="price" name="price" class="form-control infinitySelect price"></select>
                            <span class="inputError" id="priceError"></span>
                        </div>
                    </div>
                </form>
                <div id="warning-message"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button  id="saveNewTemplate" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>