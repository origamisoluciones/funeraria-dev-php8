<div class="modal fade" id="modal-add-expedient" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Nuevo <span class="bolder">Expediente</span></h4>
        </div>
        <div class="modal-body">
            <form class="form-horizontal" id="formNewExpedient" name="formNewExpedient" action="" method="post">
                <div class="form-group">
                    <label class="control-label col-sm-2" for="datepicker">Fecha</label>
                    <div class="col-sm-10">
                        <div class="input-group">
                            <input type="text" class="form-control" id="datepicker" name="datepicker" aria-describedby="datepicker" autocomplete="off">
                            <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                        </div>
                    </div>
                </div>
                <div class="bootstrap-timepicker">
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="hour">Hora</label>
                            <div class="col-sm-10">
                            <div class="input-group">
                                <input type="text" class="form-control timepicker" id="hour" name="hour" aria-describedby="hour" autocomplete="off">
                                <span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="newevent" class="col-sm-2 control-label">Evento</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" rows="3" id="newevent" name="newevent"></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label for="stat" class="col-sm-2 control-label">Estado</label>
                    <div class="col-sm-10">
                        <select class="form-control" id="stat" name="stat">
                            <option value="0">Pendiente</option>
                            <option value="1">Realizado</option>
                            <option value="2">Urgente</option>
                            <option value="3">En proceso</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modal-edit-expedient" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Editar <span class="bolder">Expediente</span></h4>
        </div>
        <div class="modal-body">
            <form class="form-horizontal" id="formEditExpedient" name="formEditExpedient" action="" method="post">
                <input type="hidden" id="id" name="id" value="">
                <div class="form-group">
                    <label class="control-label col-sm-3" for="expedientNumber">Nº Expediente</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" id="expedientNumber" name="expedientNumber" autocomplete="off">
                    </div>
                </div>
                <div class="bootstrap-timepicker">
                    <div class="form-group">
                        <label class="control-label col-sm-3" for="requestDate">Fecha Solicitud</label>
                        <div class="col-sm-9">
                            <div class="input-group">
                                <input type="text" class="form-control" id="requestDate" name="requestDate" aria-describedby="requestDate" autocomplete="off">
                                <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="name" class="col-sm-3 control-label">Nombre</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" id="name" name="name">
                    </div>
                </div>
                <div class="form-group">
                    <label for="lastname" class="col-sm-3 control-label">Apellidos</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" id="lastname" name="lastname">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client" class="col-sm-3 control-label">Cliente</label>
                    <div class="col-sm-9">
                        <select class="form-control" id="client" name="client">
                            <option value="0">Manuel</option>
                            <option value="1">Edu</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="stat" class="col-sm-3 control-label">Estado</label>
                    <div class="col-sm-9">
                        <select class="form-control" id="stat" name="stat">
                            <option value="0">Pendiente</option>
                            <option value="1">Realizado</option>
                            <option value="2">Urgente</option>
                            <option value="3">En proceso</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="expedientType" class="col-sm-3 control-label">Tipo Expediente</label>
                    <div class="col-sm-9">
                        <select class="form-control select2" id="expedientType" name="expedientType">
                            <option></option>
                            <option value="1">Defunción</option>
                            <option value="2">Presupuesto</option>
                            <option value="3">Varios</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="expedientClient" class="col-sm-3 control-label">Tipo Cliente</label>
                    <div class="col-sm-9">
                        <select class="form-control select2" id="expedientClient" name="expedientClient">
                            <option></option>
                            <option value="0">Particular</option>
                            <option value="1">Empresa</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="notes" class="col-sm-3 control-label">Notas</label>
                    <div class="col-sm-9">
                        <textarea class="form-control" rows="3" id="notes" name="notes"></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label for="user" class="col-sm-3 control-label">Usuario</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" id="user" name="user">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-delete-expedient-info" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Aviso <span class="bolder"> eliminar expediente</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p>
                        No es posible eliminar el expediente ya que tiene la factura <strong><span class="invoice-number"> asociada.</span></strong>
                    </p>
                    <p>
                        Para eliminar el expediente tienes que ir a Facturas y eliminar la factura <strong><span class="invoice-number">.</span></strong>
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