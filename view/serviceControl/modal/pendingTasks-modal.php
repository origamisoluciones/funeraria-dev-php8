<div class="modal fade" id="modal-edit-task" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
	<div class="modal-dialog modal-lg" role="document" style="width: 1050px!important;">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Editar <span id="literal" class="bolder">tareas pendientes</span> <span id=expNumber></span></h4>
			</div>
            <div class="alert alert-warning hide" id="warningMessage">
                Vista en modo lectura. Hay otro usuario (<strong><span id="firstUser"></span></strong>) en el control de servicio de este expediente
            </div>
			<div class="modal-body">
				<form class="form-horizontal" id="formEditTask" name="formEditTask">
					<input type="hidden" id="expedient">
					<div id="tasks"></div>
					<div class="modal-footer">
						<button id="cancelEditTask" type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
						<button id="saveEditTask" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal-send-email-task" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Pedidos de compra - <span class="bolder">Email</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="orderID">
                <fieldset>
                    <br>
                    <legend><span class="label label-primary labelLgExp">Datos</span></legend>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Pedido de compra</span></legend>
                        <div class="col-xs-4 centered">
                            <p><strong>Nº Pedido:</strong> <span id="number"></span></p>
                            <p><strong>Teléfono:</strong> <span id="supplierPhone"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p><strong>Fecha:</strong> <span id="date"></span></p>
                            <p><strong>Fax:</strong> <span id="supplierFax"></span></p>
                        </div>
                        <div class="col-xs-4 centered">
                            <p><strong>Proveedor:</strong> <span id="supplierName"></span></p>
                            <p><span id="supplierID" class="hide"></span></p>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Descripción del pedido</span></legend>
                        <div class="row" style="margin-top:5px">
                            <div class="col-xs-12">
                                <ul>
                                    <li class="bolder">Def.<span id="deceased"></span>, Nº Exp: <span id="expedientID"></span></li>
                                    <li>Lugar de entrega: <span id="deliveryPlace"></span></li>
                                    <li>Fecha de entrega: <span id="deliveryDate"></span></li>
                                    <li>Hora de entrega: <span id="deliveryTime"></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div id="orderLines"></div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Notas</span></legend>
                        <textarea class="form-control" id="notes" rows="3" cols="140" style="margin-top: 10px;"></textarea>
                        <br/>
                    </fieldset>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Enviar a:</span>&nbsp;<span id="send" class="bolder"></span></legend>
                        <div style="margin-top: 15px;margin-bottom: 5px;">
                            <label for="sendCopy" class="col-xs-2">Copia para:</label>
                            <input type="text" size="30" class="form-control col-xs-8" id="sendCopy" style="margin-left: -50px;margin-bottom:15px">
                            <label class="label label-success" style='margin-left: 5%;' id="sentEmail"></label>
                        </div>
                        <br>
                    </fieldset>
                </fieldset>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="sendEmail" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Enviar</button>
            </div>
        </div>
    </div>
</div>