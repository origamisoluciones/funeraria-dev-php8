<div class="modal fade" id="modal-vehicle-summary" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ficha del vehículo <span id="summaryLicense" class="bolder"> </span></h4>
            </div>
            <div class="modal-body">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Historial</span></legend>
                    <br>
                <div class="clearfix table-responsive">
                    <table class="table table-striped table-bordered display" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Último/s realizados</th>
                                <th style="width:14%" class="centered">Fecha</th>                         
                            </tr>
                        </thead>
                        <tbody id="tableBodyLast"></tbody>
                    </table>
                </div>
                <div class="clearfix table-responsive">
                    <table class="table table-striped table-bordered display" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Siguiente/s a realizar</th>
                                <th style="width:14%" class="centered">Fecha</th>                      
                            </tr>
                        </thead>
                        <tbody id="tableBodyNext"></tbody>
                    </table>
                </div>
            </div>
            </fieldset>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="donwloadSummary" type="button" class="btn btn-primary "><i class="fa fa-download" aria-hidden="true"></i> Descargar Ficha</button>
            </div>
        </div>
    </div>
</div>