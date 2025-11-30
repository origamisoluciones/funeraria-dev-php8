<div class="modal fade" id="modal-new-cemetery" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Cementerio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Cementerio</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                            <span class="inputError" id="addressError"></span>
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
                        <label for="location" class="col-xs-3 control-label">Latitud</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" class="form-control" id="latitude" name="latitude" autocomplete="none">
                            <span class="inputError" id="latitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-3 control-label">Longitud</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" class="form-control" id="longitude" name="longitude" autocomplete="none">
                            <span class="inputError" id="longitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group situation-link clearfix">
                        <div class="col-xs-offset-3 col-xs-9">
                            <a id="goToMaps" target="_blank"><i class="fa fa-map-marker c-blue" aria-hidden="true"></i> Ver situación en <span class="bolder">Google Maps</span></a>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone" autocomplete="none">
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
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewCemetery" name="saveNewCemetery" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-cemetery" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Cementerio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="cemeteryID" name="cemeteryID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Cementerio</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                            <span class="inputError" id="addressError"></span>
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
                        <label for="latitude" class="col-xs-3 control-label">Latitud</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" class="form-control" id="latitude" name="latitude" autocomplete="none">
                            <span class="inputError" id="latitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="longitude" class="col-xs-3 control-label">Longitud</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" class="form-control" id="longitude" name="longitude" autocomplete="none">
                            <span class="inputError" id="longitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group situation-link clearfix">
                        <div class="col-xs-offset-3 col-xs-9">
                            <a id="goToMaps" target="_blank"><i class="fa fa-map-marker c-blue" aria-hidden="true"></i> Ver situación en <span class="bolder">Google Maps</span></a>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone" autocomplete="none">
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
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditCemetery" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>