<div class="modal fade" id="modal-edit-refuel" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Repostaje</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditRefuel" name="formEditRefuel">
                    <input type="hidden" name="ID" id="ID">
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label for="gasStation" class="col-xs-3 control-label">Gasolinera</label>
                                <div class="col-xs-9">
                                    <input type="text" size="25" id="gasStation" name="gasStation" class="form-control" />
                                    <span class="inputError" id="gasStationError"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="liters" class="col-xs-3 control-label">Litros</label>
                                <div class="col-xs-9">
                                    <input type="number" min=0 id="liters" name="liters" class="form-control" />
                                    <span class="inputError" id="litersError"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="date" class="col-xs-3 control-label">Fecha</label>
                                <div class="col-xs-8">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="date" name="date">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label for="kms" class="col-xs-3 control-label">Kilómetros al repostar</label>
                                <div class="col-xs-9">
                                    <input type="number" min="0" id="kms" name="kms" disabled class="form-control"/>
                                    <span class="inputError" id="kmsError"></span>
                                </div>
                            </div>                            
                            <div class="form-group">
                                <label for="totalCost" class="col-xs-3 control-label">Importe</label>
                                <div class="col-xs-9">
                                    <input type="number" min="0" id="totalCost" name="totalCost" class="form-control" />
                                    <span class="inputError" id="totalCostError"></span>
                                </div>
                            </div>                            
                        </div>
                    </div>                                     
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditRefuel" name="saveEditRefuel" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>