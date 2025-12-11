<div class="modal fade" id="modal-send-email2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Pedidos <span class="bolder">de compra</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="oID">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Datos</span></legend>
                    <br>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Pedido de compra</span></legend>
                        <div class="col-xs-4 centered">
                            <p>Nº Pedido: <span id="number2" class="label label-primary small"></span></p>
                            <p>Teléfono: <span id="supplierPhone2" class="bolder"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p>Fecha: <span id="date2" class="bolder"></span></p>
                            <p>Fax: <span id="supplierFax2" class="bolder"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p>Proveedor:</p>
                            <p><span id="supplierName2" class="bolder"></span></p>
                            <p><span id="supplierID2" class="hide"></span></p>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Descripción del pedido</span></legend>
                        <div class="row">
                            <div class="col-xs-12">
                                <ul>
                                    <li id="data1" class="bolder">Def.<span id="deceased2"></span>, Nº Exp: <span id="expedient2"></span></li>
                                    <li>Lugar de entrega: <span id="deliveryPlace2"></span></li>
                                    <li>Fecha de entrega: <span id="deliveryDate2"></span></li>
                                    <li>Hora de entrega: <span id="deliveryTime2"></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div id="orderLines2"></div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Notas</span></legend>
                        <textarea class="form-control" id="notes1" rows="3" cols="140"></textarea>
                        <br/>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Enviar a:</span>&nbsp;<span id="send2" class="bolder"></span></legend>
                        <label for="sendCopy2" class="col-xs-4">Copia para:</label>
                        <input type="text" class="form-control col-xs-8" id="sendCopy2">
                        <div class="row">
                            <div class="col-xs-12">
                                <label class="label label-success" id="sentEmail2"></label>
                            </div>
                        </div>
                        <br>
                    </fieldset>
                </fieldset>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="sendEmail2" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Enviar</button>
            </div>
        </div>
    </div>
</div>