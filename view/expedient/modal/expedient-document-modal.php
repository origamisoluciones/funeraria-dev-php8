<div class="modal fade" id="modal-view-docs" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"> <span class="bolder"></span><p id="docType"></p></h4>
            </div>
            <div class="modal-body">
                <div class="pull-left">
                    <div class="box-actions">
                        <a class="btn btn-default btn-sm" id="modal-new-doc"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO</a>
                    </div>
                </div>
                <div class="clearfix table-responsive">
                    <table id="docs-multiple" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-view-orders" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Pedidos de compra</span></h4>
            </div>
            <div class="modal-body">
                <div class="fieldset">
                    <div class="clearfix table-responsive orders"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-view-condolences" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Pésames web</span></h4>
            </div>
            <div id="downloadSelectedError" class="alert alert-warning hide" role="alert">
                Debe seleccionar algún pésame para descargar
            </div>
            <div class="modal-body">
                <div class="fieldset">
                    <button id="downloadAll" type="button" class="btn btn-primary" style="margin:5px" ><i class="fa fa-download" aria-hidden="true"></i> Descargar todo</button>
                    <button id="downloadSelected" type="button" class="btn btn-primary" style="margin:5px" ><i class="fa fa-download" aria-hidden="true"></i> Descargar seleccionados</button>
                    <div class="clearfix table-responsive condolences"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-send-email" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
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

<div class="modal fade" id="modal-sign" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Seleccione una <span class="bolder">opción de firma</span></h4>
            </div>
            <div class="modal-body" style="margin-left:10px;padding-bottom:15px">
                <input type="hidden" id="docname">
                <input type="hidden" id="docpath">
                <div class="alert alert-info hide" id="signConfirmMobile">En breves se enviará una petición de firma al dispositivo móvil vinculado</div>
                <div class="alert alert-info hide" id="signConfirmDesktop">
                    En breves se abrirá una nueva pestaña para seleccionar el tipo de firma.
                    Una vez que firme el documento, cierre la pestaña para volver a la aplicación
                </div>
                <span for="signMobile">Firma mediante SMS</span><br>
                <input type="phone" class="form-control" id="phoneNotification" placeholder="Indica el teléfono al que se le enviará la solicitud..." size="45">
                <span class="phoneNotificationError c-red hide">El número de teléfono es incorrecto</span><br class="phoneNotificationError hide">
                <button type="button" class="btn btn-primary" style="margin-top:0.5em;" id="signMobile"><i class="fa fa-mobile" aria-hidden="true"></i> Firmar</button>
                <br><br>
                <span for="signDesktop">Firma mediante Wacom o navegador</span><br>
                <button type="button" class="btn btn-primary" id="signDesktop"><i class="fa fa-tablet" aria-hidden="true"></i> / <i class="fa fa-laptop" aria-hidden="true"></i></i> Firmar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-send-docs-emails" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"> Enviar <span id="title" class="bolder"></span> por email</h4>
            </div>
            <div class="modal-body">
               
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box-body">
                                <ul class="nav nav-tabs" style="margin-bottom:15px">
                                    <li style="padding-right: 5px;" role="presentation" class="active">
                                        <a data-toggle="tab" href="#historyDocsSentSection" id="goHistoryDocsSent">Histórico de envíos</a>
                                    </li>
                                    <li style="padding-right: 5px;" role="presentation">
                                        <a data-toggle="tab" href="#sendDocSection" id="goSendDoc">Enviar documento</a>
                                    </li>
                                </ul>
                                <div class="tab-pane fade in active" id="historyDocsSentSection">
                                    <div class="clearfix table-responsive docsSentSection">
                                        <table id="docs-sent-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                    </div>
                                </div>
                                <div class="tab-pane hide" id="sendDocSection">
                                    <div id="warning-message"></div>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Asistentes</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="assistants" name="assistants" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Campaneros</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="bellringers" name="bellringers" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Cementerios</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="cemeteries" name="cemeteries" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Clientes</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="clients" name="clients" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Coros</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="choirs" name="choirs" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Curas</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="priests" name="priests" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Enterradores</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="gravediggers" name="gravediggers" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Iglesias</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="churches" name="churches" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Médicos</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="doctors" name="doctors" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Personal</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="staff" name="staff" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Porteadores</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="carriers" name="carriers" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Proveedores</span></legend>
                                        <div class="form-group">
                                            <div class="col-xs-12" style="margin-bottom: 15px;">
                                                <select id="suppliers" name="suppliers" class="form-control"></select>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <form id="otherEmailForm">
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Otros emails</span></legend>
                                            <div class="alert alert-info">
                                                Introduce emails de forma manual a los que se les enviará el documento. <strong>Deben de ir separados por ;</strong>
                                            </div>
                                            <div class="form-group">
                                                <div class="col-xs-12" style="margin-bottom: 15px;margin-top: 5px;">
                                                    <input type="otherEmail" class="form-control" id="otherEmail" name="otherEmail" style="width: 100%!important; font-size: 14px;" placeholder="Introduce los emails...">
                                                    <span class="inputError" id="otherEmailError"></span>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                <button  id="send" type="button" class="btn btn-primary hide"><i class="fa fa-envelope" aria-hidden="true"></i> Enviar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-send-docs-users-emails" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"> Destinatarios</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="box-body">
                            <div class="clearfix table-responsive docsSentEmailsSection">
                                <table id="docs-sent-emails-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Atrás</button>
            </div>
        </div>
    </div>
</div>