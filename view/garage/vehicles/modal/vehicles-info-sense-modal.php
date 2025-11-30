<div class="modal fade" id="modal-info-sense-vehicles" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Info vehículo - <span id="plate"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <p>Velocidad media durante el período seleccionado: <span id="speedAvg"></span></p>
                        <div style="max-height: calc(100vh - 150px); overflow-y: auto;">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Localización</th>
                                            <th>Velocidad</th>
                                            <th>Estado motor</th>
                                            <th>Estado puertas</th>
                                            <th>Temperatura</th>
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