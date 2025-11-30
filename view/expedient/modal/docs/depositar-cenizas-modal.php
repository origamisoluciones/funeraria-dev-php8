<div id="depositar-cenizas-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="depositar-cenizas-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/depositarCenizas'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Despositar cenizas</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <p>A la atención de <input type="text" name="attention"></p>
                            <p>
                                <input type="text" name="applicantPrefix"> <input type="text" name="applicantName">, con D.N.I.
                                <input type="text" name="applicantDni">como <input type="text" name="owner"> del nicho Nº
                                <input type="text" name="nicheNumber"> del Cementerio <input type="text" name="cemetery">
                            </p>
                            <p>
                                Autorizo a <input type="text" name="authorizedPre"> <input type="text" name="authorized"> a
                                depositar <input type="text" name="deposit"> de <input type="text" name="deceasedPrefix"> 
                                <input type="text" name="deceased">, en el nicho anteriormente citado.
                            </p>
                            <p>
                                En <input type="text" name="location">, a <input type="text" name="date">
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm" id="goDepositar"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>