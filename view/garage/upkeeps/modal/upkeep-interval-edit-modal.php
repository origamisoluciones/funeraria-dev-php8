<div class="modal fade" id="modal-edit-upkeep-intervals" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="upkeepIntervalsTitle" class="modal-title"></h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-info alert-dismissible fade in" role="alert"> 
                    Si no existe un mantenimiento previo, se tomará como fecha de referencia la del alta del vehículo.
                </div>
                <form class="form-horizontal" id="formEditUpkeepInterval" name="formEditUpkeepInterval">
                    <input type="hidden" name="vehicleID" id="vehicleID">
                    <div class="row form-group">
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Aceite motor</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="engineOilKm" name="engineOilKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="engineOilTime" name="engineOilTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Filtro de aceite</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="oilFilterKm" name="oilFilterKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="oilFilterTime" name="oilFilterTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Filtro de combustible</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="fuelFilterKm" name="fuelFilterKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="fuelFilterTime" name="fuelFilterTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>

                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Filtro de aire</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="airFilterKm" name="airFilterKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="airFilterTime" name="airFilterTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Filtro de cabina</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="boxATFKm" name="boxATFKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="boxATFTime" name="boxATFTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                       
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Bujías/Calentadores</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="sparkPlugKm" name="sparkPlugKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="sparkPlugTime" name="sparkPlugTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Líquido refrigerante</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="coolingLiquidKm" name="coolingLiquidKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="coolingLiquidTime" name="coolingLiquidTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                        
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Líquido de frenos</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="brakesLiquidKm" name="brakesLiquidKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="brakesLiquidTime" name="brakesLiquidTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div class="row form-group">
                    <div class="col-xs-3">
                        <fieldset>
                            <legend><span class="label label-primary labelLgExp">Batería</span></legend>
                            <div class="input-group">
                                <input type="text" size="5" id="batteryKm" name="batteryKm" class="form-control" aria-describedby="kilómetros" />
                                <div class="input-group-addon">Kms.</div>
                            </div>
                            <div class="input-group">
                                <input type="text" size="5" id="batteryTime" name="batteryTime" class="form-control" aria-describedby="meses" />
                                <div class="input-group-addon">Meses</div>
                            </div>
                        </fieldset>
                        </div>
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Frenos delanteros</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="frontBrakesKm" name="frontBrakesKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="frontBrakesTime" name="frontBrakesTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Frenos traseros</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="rearBrakesKm" name="rearBrakesKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="rearBrakesTime" name="rearBrakesTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Correa de distribución</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="timingBeltKm" name="timingBeltKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="timingBeltTime" name="timingBeltTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Ruedas traseras</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="converterATFKm" name="converterATFKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="converterATFTime" name="converterATFTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div> 
                         <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Ruedas delanteras</span></legend>
                                <div class="input-group">
                                        <input type="text" size="5" id="differentialATFKm" name="differentialATFKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="differentialATFTime" name="differentialATFTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>
                         <div class="col-xs-3">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Alineado de dirección</span></legend>
                                <div class="input-group">
                                    <input type="text" size="5" id="otherFiltersKm" name="otherFiltersKm" class="form-control" aria-describedby="kilómetros" />
                                    <div class="input-group-addon">Kms.</div>
                                </div>
                                <div class="input-group">
                                    <input type="text" size="5" id="otherFiltersTime" name="otherFiltersTime" class="form-control" aria-describedby="meses" />
                                    <div class="input-group-addon">Meses</div>
                                </div>
                            </fieldset>
                        </div>

                            <input type="text" size="5" id="otherBeltsKm" name="otherBeltsKm" class="form-control hide" aria-describedby="kilómetros" value=""/>
                            <input type="text" size="5" id="otherBeltsTime" name="otherBeltsTime" class="form-control hide" aria-describedby="meses" value="" />
                            <input type="text" size="5" id="oilingKm" name="oilingKm" class="form-control hide" aria-describedby="kilómetros" value=""/>
                            <input type="text" size="5" id="oilingTime" name="oilingTime" class="form-control hide" aria-describedby="meses" value=""/>
                                
                        
                        
                        
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-12">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Observaciones</span></legend>
                                <textarea id="notes" name="notes" class="form-control" rows="5" cols="100"></textarea>
                            </fieldset>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditUpkeepInterval" name="saveEditUpkeepInterval" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>
    