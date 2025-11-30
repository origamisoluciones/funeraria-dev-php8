<div class="modal fade" id="modal-edit-upkeep" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" style="width: 1000px!important" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="upkeepTitle" class="modal-title"></h4>
            </div>
            <div id="errorMessage"></div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditUpkeep" name="formEditUpkeep">
                    <input type="hidden" name="vehicleID" id="vehicleID">
                    <input type="hidden" name="ID" id="ID">
                   
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label for="date" class="col-xs-3 control-label">Fecha</label>
                                <div class="col-xs-9">
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" id="date" name="date" autocomplete="off">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="dateError"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="cost" class="col-xs-3 control-label">Importe</label>
                                <div class="col-xs-9">
                                    <input type="number" min="0" id="cost" name="cost" class="form-control" />
                                    <span class="inputError" id="costError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label for="kms" class="col-xs-3 control-label">Kilómetros</label>
                                <div class="col-xs-9">
                                    <input type="number" min="0" id="kms" name="kms" class="form-control" />
                                    <span class="inputError" id="kmsError"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="garage" class="col-xs-3 control-label">Taller</label>
                                <div class="col-xs-9">
                                    <select id="garage" name="garage" class="form-control garage"></select>
                                    <span class="inputError" id="garageError"></span>
                                </div>
                            </div>
                        </div>
                        <div id="kmsOverError" class="col-xs-12 hide">
                            <label for="kms" class="label label-danger">Los kilómetros a introducir deben ser mayores que los últimos introducidos</label>
                            <br><br>
                        </div>
                    </div>
                    <br>
                    <fieldset id="pendingTask" class="hide" style="border: 1px solid red">
                        <legend><span class="label label-danger labelLgExp">Mantenimientos pendientes</span></legend>
                        <div class="form-group">
                            <div class="col-xs-12" style="padding-left: 15px" id="pendingList"></div>
                        </div>
                    </fieldset>
                    <fieldset id="tasks">
                        <legend><span class="label label-primary labelLgExp">Tareas de mantenimiento a realizar</span></legend>
                        <div class="form-group">
                            <div class="col-xs-12 centered">
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="engineOil" id="engineOil"> Aceite motor
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="oilFilter" id="oilFilter"> Filtro de aceite
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="fuelFilter" id="fuelFilter"> Filtro de combustible
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="airFilter" id="airFilter"> Filtro de aire
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="boxATF" id="boxATF"> Filtro cabina
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="sparkPlug" id="sparkPlug"> Bujías/Calentadores
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="coolingLiquid" id="coolingLiquid"> Líquido refrigerante
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="brakesLiquid" id="brakesLiquid"> Líquido de frenos
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="battery" id="battery"> Batería
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="frontBrakes" id="frontBrakes"> Frenos delanteros
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="rearBrakes" id="rearBrakes"> Frenos traseros
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="timingBelt" id="timingBelt"> Correa distribución
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="converterATF" id="converterATF"> Ruedas traseras
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="differentialATF" id="differentialATF"> Ruedas delanteras
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="otherFilters" id="otherFilters"> Alineado de dirección
                                </label>
                                
                                <input class="hide" type="checkbox" name="oiling" id="oiling"> 
                                <input class="hide" type="checkbox" name="otherBelts" id="otherBelts"> 
                            </div>      
                        </div>
                    </fieldset>
                    <div class="alert alert-warning alert-dismissible fade in hide" role="alert" id="tasksEmpty"> Debe escoger al menos una tarea de mantenimiento</div>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Observaciones</span></legend>
                        <div class="form-group">
                            <div class="col-xs-offset-1 col-xs-10">
                                <textarea id="notes" name="notes" class="form-control" rows="5" cols="80"></textarea>
                            </div>
                        </div>
                    </fieldset>                    
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditUpkeep" name="saveEditUpkeep" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>
    