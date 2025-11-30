<div class="modal fade" id="modal-new-salary" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Salario</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewSalary" name="formNewSalary">
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="template" class="col-xs-5 control-label">Plantilla</label>
                            <div class="col-xs-7">
                                <select id="template" name="template" class="form-control template"></select>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="user" class="col-xs-5 control-label ">
                                <span class="bge-blue-light"  title="Añade un usuario para tener en cuenta en el listado de salarios">Usuario</span>
                            </label>
                            <div class="col-xs-7">
                                <select id="user" name="user" class="form-control"></select>
                                <span class="inputError" id="userError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="startDay" class="col-xs-5 control-label">Período</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <div class="input-group-addon">DESDE</div>
                                    <input type="number" min="1" max="31" id="startDay" name="startDay" class="form-control" placeholder="Día del mes" autocomplete="none">
                                </div>
                                <span class="inputError" id="startDayError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="endDay" class="col-xs-5 control-label">Período</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <div class="input-group-addon">HASTA</div>
                                    <input type="number" min="1" max="31" id="endDay" name="endDay" class="form-control" placeholder="Día del mes" autocomplete="none">
                                </div>
                                <span class="inputError" id="endDayError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="taxBase" class="col-xs-5 control-label">Importe de la base</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="taxBase" name="taxBase" class="form-control" autocomplete="none">
                                <span class="inputError" id="taxBaseError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="IRPF" class="col-xs-5 control-label">IRPF (retención)</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="IRPF" name="IRPF" class="form-control" autocomplete="none">
                                <span class="inputError" id="IRPFError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="liquid" class="col-xs-5 control-label">Líquido</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="liquid" name="liquid" class="form-control" autocomplete="none">
                                <span class="inputError" id="liquidError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDay" class="col-xs-5 control-label">Fecha de pago</label>
                            <div class="col-xs-7">
                                <input type="number" min="1" max="31" id="paymentDay" name="paymentDay" class="form-control" placeholder="Día del mes" autocomplete="none">
                                <span class="inputError" id="paymentDayError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="costCenter" class="col-xs-5 control-label">Centro de coste</label>
                            <div class="col-xs-7">
                                <select id="costCenter" name="costCenter" class="form-control"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewSalary" name="saveNewSalary" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-salary" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Salario</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditSalary" name="formEditSalary">
                    <input type="hidden" id="ID">
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="template" class="col-xs-5 control-label">Plantilla</label>
                            <div class="col-xs-7">
                                <select id="template" name="template" class="form-control template"></select>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="user" class="col-xs-5 control-label ">
                                <span class="bge-blue-light"  title="Añade un usuario para tener en cuenta en el listado de salarios">Usuario</span>
                            </label>
                            <div class="col-xs-7">
                                <select id="user" name="user" class="form-control"></select>
                                <span class="inputError" id="userError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="startDay" class="col-xs-5 control-label">Período</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <div class="input-group-addon">DESDE</div>
                                    <input type="number" min="1" max="31" id="startDay" name="startDay" class="form-control" placeholder="Día del mes" autocomplete="none">
                                </div>
                                <span class="inputError" id="startDayError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="endDay" class="col-xs-5 control-label">Período</label>
                            <div class="col-xs-7">
                                <div class="input-group">
                                    <div class="input-group-addon">HASTA</div>
                                    <input type="number" min="1" max="31" id="endDay" name="endDay" class="form-control" placeholder="Día del mes" autocomplete="none">
                                </div>
                                <span class="inputError" id="endDayError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="taxBase" class="col-xs-5 control-label">Importe de la base</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="taxBase" name="taxBase" class="form-control" autocomplete="none">
                                <span class="inputError" id="taxBaseError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="IRPF" class="col-xs-5 control-label">IRPF (retención)</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="IRPF" name="IRPF" class="form-control" autocomplete="none">
                                <span class="inputError" id="IRPFError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="liquid" class="col-xs-5 control-label">Líquido</label>
                            <div class="col-xs-7">
                                <input type="number" min="0" id="liquid" name="liquid" class="form-control" autocomplete="none">
                                <span class="inputError" id="liquidError"></span>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <label for="paymentDay" class="col-xs-5 control-label">Fecha de pago</label>
                            <div class="col-xs-7">
                                <input type="number" min="1" max="31" id="paymentDay" name="paymentDay" class="form-control" placeholder="Día del mes" autocomplete="none">
                                <span class="inputError" id="paymentDayError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-xs-6">
                            <label for="costCenter" class="col-xs-5 control-label">Centro de coste</label>
                            <div class="col-xs-7">
                                <select id="costCenter" name="costCenter" class="form-control"></select>
                                <br><span class="inputError" id="costCenterError"></span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveEditSalary" name="saveEditSalary" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div> 
        </div>
    </div>
</div>