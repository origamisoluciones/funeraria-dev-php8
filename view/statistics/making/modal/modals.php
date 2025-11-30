<div class="modal fade" id="modal-list-expedients" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span id="mortuaryName" class="bolder"></span> - <span id="modalType">Expedientes</span> <span id="titleName" class="bolder"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">                        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="table-responsive listExpedientsEst">
                            <table id="listExpedients" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th class="text-center">Nº EXP.</th>
                                        <th class="text-center">Tipo de Expediente</th>
                                        <th class="text-center">Fecha solicitud</th>
                                        <th class="text-center">Difunto</th>
                                        <th class="text-center">Cliente</th>
                                        <th class="text-center">Tipo de Cliente</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="exportSummaryExpedients" class="btn btn-primary exportSummaryExpedients" style="margin-left: 1%"><i class="fa fa-file-excel-o"></i> Exportar</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-list-facturacion" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span id="mortuaryName" class="bolder"></span> - <span id="modalType">Facturación</span> <span id="titleName" class="bolder"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">                        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="table-responsive listExpedientsEst">
                            <table id="listFacturacion" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="exportSummaryFacturado" class="btn btn-primary exportSummaryFacturado" style="margin-left: 1%"><i class="fa fa-file-excel-o"></i> Exportar</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-list-invoicesPaid" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span id="mortuaryName" class="bolder"></span> - Facturas cobradas de <span id="titleName" class="bolder"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">                        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div id="divTableInvoices" class="table-responsive listExpedientsEst">
                            <table id="listPaidInvoices" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="exportSummaryCobrado" class="btn btn-primary exportSummaryCobrado" style="margin-left: 1%"><i class="fa fa-file-excel-o"></i> Exportar</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>

<div class="modal fade" id="modal-list-invoicesPaid-pending" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span id="mortuaryName" class="bolder"></span> - Facturas pendientes de <span id="titleName" class="bolder"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">                        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div id="divTableInvoices" class="table-responsive listExpedientsEst">
                            <table id="listPaidInvoicesPending" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="exportSummaryPending" class="btn btn-primary exportSummaryPending" style="margin-left: 1%"><i class="fa fa-file-excel-o"></i> Exportar</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                
            </div> 
        </div>
    </div>
</div>