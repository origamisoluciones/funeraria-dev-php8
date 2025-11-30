<div class="modal fade" id="destination-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">
                    Detalles de servicios
                </h4>
            </div>
            <div class="modal-body">   
                <div class="row">
                    <div class="col-12" style="margin-left:1.75em;">
                        <p>
                            Cliente: <span id="clientNameDestination" class="bolder"></span> 
                            <br>
                            Fallecido en: <span id="deceasedInDestination" class="bolder"></span> 
                            <br>
                            Casa Mortuoria: <span id="mortuaryDestination" class="bolder"></span> 
                        </p>
                    </div>
                </div>              
                <table class="table table-striped table-responsive table-bordered" id="tableDestinationModal" width="100%" cellspacing="0">
                    <thead>
                        <th style="vertical-align: middle;">Iglesia Parroquial</th>
                        <th style="vertical-align: middle;">Crematorio</th>
                        <th style="vertical-align: middle;">Cementerio</th>
                        <th class="text-center" style="vertical-align: middle;">Núm. servicios</th>
                        <th class="text-center" style="vertical-align: middle;">Coste medio servicio</th>
                        <th class="text-center" style="vertical-align: middle;">Hombres</th>
                        <th class="text-center" style="vertical-align: middle;">Mujeres</th>
                    </thead>
                    <tbody id="destModalBody"></tbody>
                </table>               
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="expedients-info-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Servicios de la Iglesia Parroquial de <span id="churchInfoName" class="bolder"></span></h4>
            </div>
            <div class="modal-body">                 
                <table class="table table-striped table-responsive table-bordered" id="tableExpedientsInfo" width="100%" cellspacing="0">
                    <thead>
                        <th class="text-center" style="vertical-align: middle;">Expediente</th>
                        <th class="text-center" style="vertical-align: middle;">Ver</th>
                    </thead>
                    <tbody id="expedientsInfoBody"></tbody>
                </table>               
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>