<div class="modal fade" id="modal-new-destinarion-middle" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Lugar de Destino Intermedio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewMiddleData" name="formNewMiddleData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="provinceMiddle" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="provinceMiddle" name="provinceMiddle" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="locationMiddle" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="locationMiddle" name="locationMiddle" class="form-control location"></select>
                            <span class="inputError" id="locationMiddleError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDestinationMiddle" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-destinarion-middle" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Lugar de Destino Intermedio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditMiddleData" name="formEditMiddleData">
                    <input type="hidden" id="destinationPlaceID" name="destinationPlaceID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="provinceMiddleEdit" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="provinceMiddleEdit" name="provinceMiddleEdit" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="locationMiddleEdit" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="locationMiddleEdit" name="locationMiddleEdit" class="form-control location"></select>
                            <span class="inputError" id="locationMiddleEditError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDestinationMiddle" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-destinarion-final" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Lugar de Destino Final</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewFinalData" name="formNewFinalData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="provinceFinal" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="provinceFinal" name="provinceFinal" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="locationFinal" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="locationFinal" name="locationFinal" class="form-control location"></select>
                            <span class="inputError" id="locationFinalError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDestinationFinal" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-destinarion-final" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Lugar de Destino Intermedio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditFinalData" name="formEditFinalData">
                    <input type="hidden" id="destinationPlaceID" name="destinationPlaceID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="provinceFinalEdit" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="provinceFinalEdit" name="provinceFinalEdit" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="locationFinalEdit" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="locationFinalEdit" name="locationFinalEdit" class="form-control location"></select>
                            <span class="inputError" id="locationFinalEditError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDestinationFinal" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>