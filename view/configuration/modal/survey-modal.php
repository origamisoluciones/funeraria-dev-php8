<div class="modal fade" id="modal-new-service" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Servicio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="service" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="service" name="service" autocomplete="none">
                            <span class="inputError" id="serviceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="position" class="col-xs-3 control-label">Posición</label>
                        <div class="col-xs-9">
                            <input type="number" step="1" min="0" class="form-control" id="position" name="position" value="0" autocomplete="none">
                            <span class="inputError" id="positionError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewService" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-service" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Servicio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="ID" name="ID" value="">
                    <div class="form-group">
                        <label for="service" class="col-xs-3 control-label">Servicio</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="service" name="service" autocomplete="none">
                            <span class="inputError" id="serviceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="position" class="col-xs-3 control-label">Posición</label>
                        <div class="col-xs-9">
                            <input type="number" step="1" min="0" class="form-control" id="position" name="position" value="0" autocomplete="none">
                            <span class="inputError" id="positionError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditService" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-preview-survey" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ver <span class="bolder">Cuestionario de Satisfacción</span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                    
                        <fieldset>
                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Cuestionario de Satisfacción</span></legend>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Valoración de servicios</th>
                                                    <th class="text-center">Excelente (5)</th>
                                                    <th class="text-center">Buena (4)</th>
                                                    <th class="text-center">Regular (3)</th>
                                                    <th class="text-center">Mala (2)</th>
                                                    <th class="text-center">Muy mala (1)</th>
                                                    <th class="text-center">No aplica</th>
                                                </tr>
                                            </thead>
                                            <tbody id="surveyBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>