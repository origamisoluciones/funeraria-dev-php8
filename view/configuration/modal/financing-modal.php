<div class="modal fade" id="modal-new-financing" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Financiación</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewFinancing" name="formNewFinancing">
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="destination" class="col-xs-5 control-label">Destino</label>
                            <div class="col-xs-7">
                                <select id="destination" class="destination" name="destination" class="form-control"></select>
                                <span class="inputError" id="destinationError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="type" class="col-xs-5 control-label">Tipo de financiación</label>
                            <div class="col-xs-7">
                                <select id="type" name="type" class="form-control">
                                    <option value="0">Crédito Hipotecario</option>
                                    <option value="1">Préstamos personal</option>
                                    <option value="2">Leasing</option>
                                    <option value="3">Renting</option>
                                </select>
                                <span class="inputError" id="typeError"></span>
                            </div>
                        </div>
                    </div>                    
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="startDate" class="col-xs-5 control-label">Fecha de cargo</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="24" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha de inicio" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="startDateError"></span>
                            </div>
                        </div>                    
                        <div class="col-xs-6">
                            <label for="term" class="col-xs-5 control-label">Plazos</label>
                            <div class="col-xs-7">
                                <select id="term" name="term" class="form-control">
                                    <option value="12">1 año</option>
                                    <option value="24">2 años</option>
                                    <option value="36">3 años</option>
                                    <option value="48">4 años</option>
                                    <option value="60">5 años</option>
                                    <option value="72">6 años</option>
                                    <option value="84">7 años</option>
                                    <option value="96">8 años</option>
                                    <option value="108">9 años</option>
                                    <option value="120">10 años</option>
                                    <option value="132">11 años</option>
                                    <option value="144">12 años</option>
                                    <option value="166">13 años</option>
                                    <option value="178">14 años</option>
                                    <option value="180">15 años</option>
                                    <option value="192">16 años</option>
                                    <option value="204">17 años</option>
                                    <option value="216">18 años</option>
                                    <option value="228">19 años</option>
                                    <option value="240">20 años</option>
                                    <option value="252">21 años</option>
                                    <option value="264">22 años</option>
                                    <option value="276">23 años</option>
                                    <option value="288">24 años</option>
                                    <option value="300">25 años</option>
                                </select>
                            </div>
                        </div>   
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="amortization" class="col-xs-5 control-label">Capital a financiar</label>
                            <div class="col-xs-7">
                                <input type="number" size="10" id="amortization" name="amortization" class="form-control" aria-describedby="Capital a financiar" autocomplete="none"/>
                            </div>
                        </div>                    
                        <div class="col-xs-6">
                            <label for="initialCapital" class="col-xs-5 control-label">Entrega inicial</label>
                            <div class="col-xs-7">
                                <input type="number" size="10" id="initialCapital" name="initialCapital" class="form-control" aria-describedby="Entrega inicial" autocomplete="none"/>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="openingCommission" class="col-xs-5 control-label">Comisión de apertura</label>
                            <div class="col-xs-7">
                                <input type="number" size="10" id="openingCommission" name="openingCommission" class="form-control" aria-describedby="capital" autocomplete="none"/>
                            </div>
                        </div>                    
                        <div class="col-xs-6">
                            <label for="closeCommission" class="col-xs-5 control-label">Comisión de cancelación</label>
                            <div class="col-xs-7">
                                <input type="number" size="10" id="closeCommission" name="closeCommission" class="form-control" aria-describedby="capital inicial" autocomplete="none"/>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="amortizationCommission" class="col-xs-5 control-label">Comisión de amortización</label>
                            <div class="col-xs-7">
                                <input type="number" size="10" id="amortizationCommission" name="amortizationCommission" class="form-control" aria-describedby="capital" autocomplete="none"/>
                            </div>
                        </div>    
                        <div class="col-xs-6">
                            <label for="providerEntity" class="col-xs-5 control-label">Entidad prestadora</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="providerEntity" name="providerEntity" class="form-control" aria-describedby="providerEntity" autocomplete="none"/>
                                <span class="inputError" id="providerEntityError"></span>
                            </div>
                        </div>                
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="interestType" class="col-xs-5 control-label">Tipo de interés</label>
                            <div class="col-xs-7">
                                <select id="interestType" name="interestType" class="form-control">
                                    <option value="0">Fijo</option>
                                    <option value="1">Variable</option>
                                </select>
                            </div>
                        </div>                         
                        <div class="col-xs-6">
                            <label for="interest" class="col-xs-5 control-label">Interés anual</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <input type="number" min="1" id="interest" name="interest" class="form-control" aria-describedby="plazo" autocomplete="none"/>
                                    <div class="input-group-addon">
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>                   
                    </div>
                    <div id="variableRow" class="row form-group hide">
                        <div class="col-xs-6">
                            <label for="diferencial" class="col-xs-5 control-label">Diferencial</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <input type="number" id="diferencial" name="diferencial" class="form-control" value="0,99" autocomplete="none"/>
                                    <div class="input-group-addon">
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>                   
                        <div class="col-xs-6">
                            <label for="euribor" class="col-xs-5 control-label">Euribor</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <input type="number" id="euribor" name="euribor" class="form-control" value="-0,094" autocomplete="none"/>
                                    <div class="input-group-addon">
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>                   
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="financeCenter" class="col-xs-5 control-label">Centro financiado</label>
                            <div class="col-xs-7">
                                <select id="financeCenter" class="financeCenter" name="financeCenter" class="form-control"></select>
                                <span class="inputError" id="financeCenterError"></span>
                            </div>
                        </div>                         
                        <div class="col-xs-6">
                            <label for="payMethod" class="col-xs-5 control-label">Método de pago</label>
                            <div class="col-xs-7">
                                <select id="payMethod" class="payMethod" name="payMethod" class="form-control"></select>
                                <span class="inputError" id="payMethodError"></span>
                            </div>
                        </div> 
                    </div>
                    <div class="row form-group">                      
                        <div class="col-xs-6">
                            <label for="comments" class="col-xs-5 control-label">Comentarios</label>
                            <div class="col-xs-7">
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="103"></textarea>
                            </div>
                        </div>  
                    </div>  
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewFinancing" name="saveNewFinancing" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-financing" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Financiación</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditFinancing" name="formEditFinancing">
                    <input type="hidden" id="financingID" name="financingID"/>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="destination" class="col-xs-5 control-label">Destino</label>
                            <div class="col-xs-7">
                                <select id="destination" class="destination" name="destination" class="form-control"></select>
                                <span class="inputError" id="destinationError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="type" class="col-xs-5 control-label">Tipo de financiación</label>
                            <div class="col-xs-7">
                                <select id="type" name="type" class="form-control">
                                    <option value="0">Crédito Hipotecario</option>
                                    <option value="1">Préstamos personal</option>
                                    <option value="2">Leasing</option>
                                    <option value="3">Renting</option>
                                </select>
                                <span class="inputError" id="typeError"></span>
                            </div>
                        </div>
                    </div>                    
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="startDate" class="col-xs-5 control-label">Fecha de cargo</label>
                            <div class="col-xs-7">
                                <div class="input-group date">
                                    <input type="text" size="24" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha de inicio" autocomplete="none">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="startDateError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="term" class="col-xs-5 control-label">Plazos</label>
                            <div class="col-xs-7">
                                <select id="term" name="term" class="form-control">
                                    <option value="12">1 año</option>
                                    <option value="24">2 años</option>
                                    <option value="36">3 años</option>
                                    <option value="42">4 años</option>
                                    <option value="60">5 años</option>
                                </select>
                            </div>
                        </div>                                     
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="amortization" class="col-xs-5 control-label">Capital</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="amortization" name="amortization" class="form-control" aria-describedby="capital" autocomplete="none" disabled />
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="initialCapital" class="col-xs-5 control-label">Capital inicial</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="initialCapital" name="initialCapital" class="form-control" aria-describedby="capital inicial" autocomplete="none" disabled />
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="amortizedCapital" class="col-xs-5 control-label">Amortizado</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="amortizedCapital" name="amortizedCapital" class="form-control" aria-describedby="amortizado" autocomplete="none" disabled />
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="pendingCapital" class="col-xs-5 control-label">Capital pendiente</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="pendingCapital" name="pendingCapital" class="form-control" aria-describedby="capital pendiente" autocomplete="none" disabled />
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="pendingFee" class="col-xs-5 control-label">Cuotas pendientes</label>
                            <div class="col-xs-7">
                                <input type="number" size="24" id="pendingFee" name="pendingFee" class="form-control" aria-describedby="cuotas" autocomplete="none" disabled/>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="openingCommission" class="col-xs-5 control-label">Comisión de apertura</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="openingCommission" name="openingCommission" class="form-control" aria-describedby="capital inicial" autocomplete="none" disabled />
                            </div>
                        </div>                    
                        <div class="col-xs-6">
                            <label for="closeCommission" class="col-xs-5 control-label">Comisión de cancelación</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="closeCommission" name="closeCommission" class="form-control" aria-describedby="capital inicial" autocomplete="none" disabled />
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="amortizationCommission" class="col-xs-5 control-label">Comisión de amortización</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="amortizationCommission" name="amortizationCommission" class="form-control" aria-describedby="capital inicial" autocomplete="none" disabled />
                            </div>
                        </div>  
                        <div class="col-xs-6">
                            <label for="providerEntity" class="col-xs-5 control-label">Entidad prestadora</label>
                            <div class="col-xs-7">
                                <input type="text" size="24" id="providerEntity" name="providerEntity" class="form-control" aria-describedby="providerEntity" autocomplete="none"/>
                            </div>
                        </div>                            
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="interestType" class="col-xs-5 control-label">Tipo de interés</label>
                            <div class="col-xs-7">
                                <select id="interestType" name="interestType" class="form-control">
                                    <option value="0">Fijo</option>
                                    <option value="1">Variable</option>
                                </select>
                            </div>
                        </div>                     
                        <div class="col-xs-6">
                            <label for="interest" class="col-xs-5 control-label">Interés anual</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <input type="number" min="1" id="interest" name="interest" class="form-control" aria-describedby="plazo" autocomplete="none"/>
                                    <div class="input-group-addon">
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>                   
                    </div>
                    <div id="variableRow" class="row form-group hide">
                        <div class="col-xs-6">
                            <label for="diferencial" class="col-xs-5 control-label">Diferencial</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <input type="number" id="diferencial" name="diferencial" class="form-control" value="0,99" autocomplete="none"/>
                                    <div class="input-group-addon">
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>                   
                        <div class="col-xs-6">
                            <label for="euribor" class="col-xs-5 control-label">Euribor</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <input type="number" id="euribor" name="euribor" class="form-control" value="-0,094" autocomplete="none"/>
                                    <div class="input-group-addon">
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>                   
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="financeCenter" class="col-xs-5 control-label">Centro financiado</label>
                            <div class="col-xs-7">
                                <select id="financeCenter" class="financeCenter" name="financeCenter" class="form-control"></select>
                                <span class="inputError" id="financeCenterError"></span>
                            </div>
                        </div>  
                        <div class="col-xs-6">
                            <label for="payMethod" class="col-xs-5 control-label">Método de pago</label>
                            <div class="col-xs-7">
                                <select id="payMethod" class="payMethod" name="payMethod" class="form-control"></select>
                                <span class="inputError" id="payMethodError"></span>
                            </div>
                        </div>                        
                    </div>
                    <div class="clearfix form-group">
                        <div class="col-xs-6">                      
                            <label for="comments" class="col-xs-5 control-label">Comentarios</label>
                            <div class="col-xs-7">
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="103"></textarea>
                            </div>
                        </div>  
                    </div>  
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditFinancing" name="saveEditFinancing" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-cuotas-financing" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ver <span class="bolder">Cuotas</span></h4>
            </div>
            <div class="modal-body">            
                <form class="form-horizontal" id="formViewCuotas" name="formViewCuotas">
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Datos de la financiación</span></legend>
                        <input type="hidden" id="financingID" name="financingID"/>
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="providerEntity" class="col-xs-5 control-label">Entidad prestadora</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="providerEntity" name="providerEntity" class="form-control" aria-describedby="providerEntity" autocomplete="none" disabled/>
                                    <span class="inputError" id="providerEntityError"></span>
                                </div>
                            </div>              
                            <div class="col-xs-6">
                                <label for="destination" class="col-xs-5 control-label">Destino</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="destination" name="destination" class="form-control" aria-describedby="Destino" autocomplete="none" disabled/>
                                    <span class="inputError" id="destinationError"></span>
                                </div>
                            </div>                        
                        </div> 
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="type" class="col-xs-5 control-label">Tipo</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="type" name="type" class="form-control" aria-describedby="Destino" autocomplete="none" disabled/>
                                    <span class="inputError" id="typeError"></span>
                                </div>
                            </div>                 
                            <div class="col-xs-6">
                                <label for="financeCenter" class="col-xs-5 control-label">Centro de financiado</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="financeCenter" name="financeCenter" class="form-control" aria-describedby="capital inicial" autocomplete="none" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="initialCapital" class="col-xs-5 control-label">Capital inicial</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="initialCapital" name="initialCapital" class="form-control" aria-describedby="capital inicial" autocomplete="none" disabled/>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <label for="amortizedCapital" class="col-xs-5 control-label">Capital amortizado</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="amortizedCapital" name="amortizedCapital" class="form-control" aria-describedby="capital amortizado" autocomplete="none" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="pendingCapital" class="col-xs-5 control-label">Capital pendiente</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="pendingCapital" name="pendingCapital" class="form-control" aria-describedby="capital pendiente" autocomplete="none" disabled />
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="interestType" class="col-xs-5 control-label">Tipo de interés</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="interestType" name="interestType" class="form-control" aria-describedby="capital amortizado" autocomplete="none" disabled/>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <label for="interest" class="col-xs-5 control-label">Interés anual</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="interest" name="interest" class="form-control" aria-describedby="capital pendiente" autocomplete="none" disabled />
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="openingCommission" class="col-xs-5 control-label">Comisión de apertura</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="openingCommission" name="openingCommission" class="form-control" aria-describedby="capital amortizado" autocomplete="none" disabled/>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <label for="amortizationCommission" class="col-xs-5 control-label">Comisión de amortización</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="amortizationCommission" name="amortizationCommission" class="form-control" aria-describedby="capital pendiente" autocomplete="none" disabled />
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-xs-6">
                                <label for="closeCommission" class="col-xs-5 control-label">Comisión de cancelación</label>
                                <div class="col-xs-7">
                                    <input type="text" size="22" id="closeCommission" name="closeCommission" class="form-control" aria-describedby="capital amortizado" autocomplete="none" disabled/>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Amortizaciones</span></legend>
                        <input type="hidden" id="amortizationID" name="amortizationID"/>
                        <div class="row form-group">
                            <div class="col-xs-4">
                                <label for="amortizaionSelect" class="col-xs-3 control-label">Tipo</label>
                                <div class="col-xs-9">
                                    <select name="amortizaionSelect" id="amortizaionSelect">
                                        <option value="0">Cuotas</option>
                                        <option value="1">Plazos</option>
                                    </select>
                                </div>
                            </div> 
                            <div class="col-xs-4">
                                <label for="amortizationID" class="col-xs-3 control-label">Cantidad</label>
                                <div class="col-xs-9">
                                    <input type="number" min="0" id="amortizationAmount" name="amortizationAmount" class="form-control" aria-describedby="amortizationAmount" style="width: 120px !important;"/>
                                    <span class="inputError" id="amortizationAmountError"></span>
                                </div>
                            </div> 
                            <button type="button" class="btn col-xs-4" style="width: 90px !important;" id="payAmortization"><i class="fa fa-credit-card" aria-hidden="true"></i> Amortizar</button>                                                                                   
                        </div>                       
                    </fieldset>
                    <div class="box-body">
                        <label for="years">Selecciona año: </label>
                        <select id="years"></select>
                        <div class="table-responsive">
                            <table id="datatableCuotas" class="table table-striped" width="100%" cellspacing="0">
                                <tfoot><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="row form-group">   
                        <div class="col-xs-6">                   
                            <label for="comments" class="col-xs-5 control-label">Comentarios</label>
                            <div class="col-xs-7">
                                <textarea class="form-control" name="comments" id="comments" rows="5" cols="103" disabled></textarea>
                            </div>
                        </div>  
                    </div>  
                </form>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditCuotas" name="saveEditCuotas" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>