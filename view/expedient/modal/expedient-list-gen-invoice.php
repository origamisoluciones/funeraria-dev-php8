<div class="modal fade" id="modal-gen-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Crear <span class="bolder">Factura</span></h4>
            </div>
            <div class="modal-body">
                <form id="formNewInvoice" class="form-horizontal">                    
                    <div class="form-group">
                        <label for="paymentMethod" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Método de cobro:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <select id="paymentMethod">
                                <option value="Contado">Contado</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Giro bancario">Giro bancario</option>
                                <option value="Transferencia" selected>Transferencia</option>
                            </select>
                            <span class="inputError" id="paymentMethodError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Fecha:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                                <div class="input-group date">
                                    <input type="text" size="15" class="form-control datepicker" id="date" name="date" aria-describedby="fecha" autocomplete="off">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                </div>
                                <span class="inputError" id="dateError"></span>
                            </div>
                    </div>
                    <div class="form-group">
                        <label for="comments" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Comentarios:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <textarea type="text" class="form-control" id="comments" name="comments" rows="4" cols="50"></textarea>
                        </div>
                    </div>
                    <div class="form-group accounts">
                        <label for="accountNumber" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="accountText">Nº cuenta:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 accountNum">
                            <select id="accountNumber" class="form-control"></select>
                            <span class="inputError" id="accountNumberError"></span>
                        </div>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 hide tpvDiv">
                            <div class="form-group" style="margin-bottom: 0!important;">
                                <div class="input-group">
                                    <select id="tpv" class="form-control" style="margin-left: 15px;"></select>
                                    <span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-tpv" title="Nuevo TPV de Cobro"><i class="fa fa-plus"></i></a></span>
                                </div>
                                <span class="inputError" id="tpvError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="print" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="printLabel">Generar factura:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="saveInvoice"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Generar <span class="bolder"> factura</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p id="message">Alguno de los expedientes seleccionados ya están <strong>facturados</strong>. Para volver a generar la facturar debes cambiar el estado del expediente a <strong>pendiente de facturación</strong>.</p>
                    <p class="c-red"><strong>OJO! Los precios pueden no coincidir con la factura inicial</strong></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Generar <span class="bolder"> factura</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p id="message">Alguno de los expedientes seleccionados ya están <strong>facturados</strong>. Para volver a generar la facturar debes cambiar el estado del expediente a <strong>pendiente de facturación</strong>.</p>
                    <p class="c-red"><strong>OJO! Los precios pueden no coincidir con la factura inicial</strong></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-cash-customer" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> facturación</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red"><strong>No ha sido posible generar una factura simplificada para los siguientes expedientes ya que contienen un total superior a 400 €</strong></p>
                    <ul id="expedientsNotGenerated" style="list-style: none;"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-warning-cash-customer-already-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> facturación</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red"><strong>No es posible generar una factura simplificada con un total superior a 400 €</strong></p>
                    <p id="message">
                        Ya existe una factura simplificada para este expediente.<br>No se puede generar una nueva factura de otra serie, para ello, es necesario <strong>crear un nuevo expediente</strong>.
                    </p>
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
                        <strong>No es posible guardar la contratación del expediente ya que está asociada a un <u>cliente sin identificar</u> y tiene un <u>total superior a 400 €</u></strong>
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