<div class="modal fade" id="modal-info-vehicles" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Info vehículo - <span id="plate"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <p>Distancia recorrida durante el período seleccionado: <span id="distanceAvg"></span></p>
                        <p>Consumo durante el período seleccionado: <span id="littersAvg"></span></p>
                        <div style="max-height: calc(100vh - 100px); overflow-y: auto;">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Distancia</th>
                                            <th>Litros</th>
                                            <th>Depósito</th>
                                            <th>RPM</th>
                                        </tr>
                                    </thead>
                                    <tbody id="infoTable"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>