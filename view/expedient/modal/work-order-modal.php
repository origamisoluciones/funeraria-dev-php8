<div class="modal fade" id="modal-work-orders-history" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Histórico de <span class="bolder">Órdenes de Trabajo</span></h4>
            </div>
            <div class="modal-body">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Órdenes de Trabajo</span></legend>
                    <br>
                    <div class="clearfix table-responsive">
                        <table id="listWorkOrders" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th style="text-align:center">#</th>
                                    <th style="text-align:center">Fecha y hora</th>
                                    <th style="text-align:center">Orden de Trabajo</th>
                                    <th style="text-align:center">Descargar</th>                        
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </fieldset>
                <div id="warning-message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>