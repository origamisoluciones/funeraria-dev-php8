<div class="modal fade" id="modal-breakdown-import" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Desglose del <strong>importe</strong>  - Expediente <span id="titleName" class="bolder"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">                        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="table-responsive desloseImporte">
                            <table id="desgloseImporte" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th class="text-center">Nº EXP.</th>
                                        <th class="text-center">Imp. Bruto</th>
                                        <th class="text-center">Suplidos</th>
                                        <th class="text-center">Base Imponible 10%</th>
                                        <th class="text-center"><?= $ivaLabel ?> 10%</th>
                                        <th class="text-center">Base Imponible 21%</th>
                                        <th class="text-center"><?= $ivaLabel ?> 21%</th>
                                        <th class="text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="exportImport" class="btn btn-primary exportImport" style="margin-left: 1%"><i class="fa fa-file-excel-o"></i> Exportar</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>