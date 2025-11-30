<div style="margin-top: 4%" class="modal fade" id="modal-warning-cash-customer" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> facturación</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red"><strong>No es posible generar una factura simplificada con un total superior a 400 €</strong></p>
                    <p id="message">Para generar la facturar debes identificar al cliente.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-proforma" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> facturación</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red"><strong>No es posible generar una factura para un cliente proforma</strong></p>
                    <p id="message">Para generar la facturar debes identificar al cliente.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-client-incorrect" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> facturación</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red"><strong>Es necesario identificar correctamente al cliente de la factura</strong></p>
                    <strong>Nombre del cliente:</strong>&nbsp;&nbsp;<span id="errorClientName"></span>
                    <br>
                    <strong>NIF del cliente:</strong>&nbsp;&nbsp;<span id="errorClientNif"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-cash-customer-hiring" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> contratación</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red">
                        <strong>No es posible guardar la contratación del expediente ya que está asociada a un <u>cliente de contado</u> y tiene un <u>total superior a 400 €</u></strong>
                    </p>
                    <ul id="expedientsNotGenerated" style="list-style: none;"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-go-hiring-rectified" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Rectificar <span class="bolder"> factura</span></h4>
            </div>
            <div class="modal-body">
                <p>
                    Cuando una factura ya ha sido emitida, puedes generar una copia de la contratación para modificarla.
                    A partir de esa nueva contratación, podrás emitir una <strong>factura rectificativa</strong>
                    <ul>
                        <li class="rectified-sustitution"><strong>Factura rectificativa por sustitución.</strong> Se generará una factura rectificativa que sustituye completamente a la factura original.</li>
                        <li><strong>Factura rectificativa por diferencias.</strong> Se generará una factura rectificativa que modifica las diferencias con respecto a la factura original.<br> En caso de necesitar un abono completo tendrían que ponerse a 0 las cantidades de los productos incluidos en la factura original.</li>
                    </ul>
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button  id="goGenerateRectifiedSustitucion" type="button" class="btn btn-primary rectified-sustitution"><i class="fa fa-floppy-o" aria-hidden="true"></i> Contratación por sustitución</button>
                <button  id="goGenerateRectifiedDiferencias" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Contratación por diferencias</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-go-hiring-anuled" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Anular <span class="bolder"> factura</span></h4>
            </div>
            <div class="modal-body">
                <p>
                    Si continúas, se procederá a anular la factura seleccionada a todos los efectos.<strong> Esta acción solo se recomienda en caso de que la factura se haya emitido erróneamente</strong>.
                </p>
                <p>
                    ¿Estás seguro de qué deseas <strong>anular la factura</strong>?
                </p>
                <form id="formAnuled" class="form-horizontal">
                    <div class="form-group">
                        <label for="reason" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Motivo:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <textarea type="text" class="form-control" id="reason" name="reason" rows="4" cols="50"></textarea>
                            <span class="inputError" id="reasonError"></span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button  id="goGenerateAnuled" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Confirmar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-go-cancel-hiring-rectified" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Confirmar <span class="bolder"> cancelación de contratación actual</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p>¿Estás seguro de que deseas cancelar la contratación actual?</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button  id="confirmCancelRectified" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Confirmar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-go-duplicate-expedient" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Confirmar <span class="bolder"> duplicar de expediente</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p>¿Estás seguro de que deseas duplicar el expediente actual?</p>
                    <p>Se duplicará toda la información del expediente así como su última contratación generada al nuevo cliente seleccionado.</p>
                </div>
                <div class="row">
                    <form id="formDuplicate">
                        <div class="col-xs-4">
                            <div class="form-group">
                                <label class="col-xs-6 control-label toNormal">Tipo cliente</label>
                                <div class="col-xs-6">
                                    <select id="duplicateClientType" name="duplicateClientType" class="form-control">
                                        <option value="1" selected>Particular</option>
                                        <option value="2">Seguros</option>
                                        <option value="3">Empresa</option>
                                    </select>
                                </div>
                                <div>
                                    <span class="inputError" id="duplicateClientTypeError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8">
                            <div class="form-group form-group-client">
                                <label class="col-xs-2 control-label toNormal">Cliente</label>
                                <div class="col-xs-10">
                                    <div class="input-group">
                                        <select class="form-control" id="duplicateClient" name="duplicateClient"></select>
                                        <div>
                                            <span class="inputError" id="duplicateClientError"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button  id="confirmDuplicateExpedient" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Duplicar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-go-duplicate-hiring" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Confirmar <span class="bolder"> duplicar la contratación actual</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p>¿Estás seguro de que deseas duplicar la contratación actual?</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button  id="confirm" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Confirmar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-error-create-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Error <span class="bolder"> generación de factura</span></h4>
            </div>
            <div class="modal-body">
                <p>
                    Ha ocurrido un error mientras se procesaba la factura. Por favor, vuelva a intentarlo.
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>