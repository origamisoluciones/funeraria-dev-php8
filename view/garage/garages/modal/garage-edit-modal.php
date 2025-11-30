<div class="modal fade" id="modal-edit-garage" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Taller</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditGarage" name="formEditGarage">
                    <input type="hidden" name="ID" id="ID">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Name</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="name" name="name" class="form-control" />
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" id="address" name="address" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">Correo</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" id="mail" name="mail" class="form-control" />
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="phone" class="col-xs-3 control-label">Teléfono</label>
                        <div class="col-xs-9">
                            <input type="phone" size="30" id="phone" name="phone" class="form-control" />
                            <span class="inputError" id="phoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplier" class="col-xs-3 control-label">Proveedor asociado</label>
                        <div class="col-xs-9">
                            <select id="supplier" name="supplier" class="form-control supplier"></select>
                        </div>
                    </div>
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditGarage" name="saveEditGarage" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>
    