<div class="modal fade" id="modal-new-price" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Tarifa</span></h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-info alert-dismissible fade in" role="alert">Esta acción puede tomar un tiempo en finalizar</div>
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                            <span class="label label-danger hide" id="repeatName">Ya existe una tarifa con ese nombre en ese año</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="year" class="col-xs-3 control-label">Año</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" class="form-control" id="year" name="year" autocomplete="none" disabled>
                            <span class="inputError" id="yearError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewPrice" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-price" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Tarifa</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="priceID" name="priceID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                            <span class="label label-danger hide" id="repeatName">Ya existe una tarifa con ese nombre en ese año</span>
                        </div>
                    </div>
                    <div class="form-group hide">
                        <label for="year" class="col-xs-3 control-label">Año</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" class="form-control" id="year" name="year" autocomplete="none">
                            <span class="inputError" id="yearError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditPrice" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-gen-price" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Modificar tarifa año <span class="bolder" id="year"></span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formGenData" name="formGenData">
                    <input type="hidden" id="priceID" name="priceID" value="">
                    <input type="hidden" id="yearPrice" name="yearPrice" value="">
                    <div class="form-group">
                        <label for="percent" class="col-xs-3 control-label">Incremento (%)</label>
                        <div class="col-xs-9">
                            <input type="number" min="0" class="form-control" id="percent" name="percent" autocomplete="none">
                            <span class="inputError" id="percentError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveGenPrice" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-gen-prices-next-year" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Generar tarifas para el año <span class="bolder next-year"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="alert alert-info">
                            A continuación se muestran las tarifas para el año en curso acompañadas de un <strong>incremento porcentual</strong> que se aplicará a las nuevas tarifas generadas para <span class="next-year"></span>.
                            <br><br>En caso de que el incremento <strong>se deje a 0, se aplicará la tarifa correspondiente para <span class="current-year"></span></strong>.
                        </div>
                    </div>
                    <div id="warning-message"></div>
                </div>
                <fieldset>
                    <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Tarifas vigentes en <span class="current-year"></span></legend>
                    <form class="form-horizontal" id="formNextYear" name="formNextYear"></form>
                </fieldset>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button id="saveNextYearPrices" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-show-clients" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> eliminar tarifa</span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <p style="margin-left:15px">
                            No es posible eliminar la tarifa ya que tienes <span id="totalClients" class="bolder"></span> clientes asociados a la misma. 
                            <br>
                            Modifica la tarifa de los siguientes clientes para poder eliminarla:
                        </p>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-xs-12">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th class="text-center">Nombre y apellidos</th>
                                        <th class="text-center">Nombre comercial</th>
                                        <th class="text-center">NIF</th>
                                    </tr>
                                </thead>
                                <tbody id="clientsPriceBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button type="button" id="exportListClients" class="btn btn-primary"><i class="fa fa-file-excel-o"></i> Exportar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="confirmUpdateTemplate" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Confirmación <span class="bolder">actualización de precios</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p id="message"><strong>¿Estás seguro de que quieres actualizar los precios modificados?</strong></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button  id="confirm"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Confirmar</button>
            </div>
        </div>
    </div>
</div>