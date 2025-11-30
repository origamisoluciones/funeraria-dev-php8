<div id="retirar-cenizas-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="retirar-cenizas-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/retirarCenizas'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Retirar cenizas</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <p>A la atención de</p>
                            <p><input type="text" name="attention"></p>
                            <p>
                                <input type="text" name="applicantPrefix"> <input type="text" name="applicantName">,
                                con D.N.I. <input type="text" name="applicantDni"> como <input type="text" name="owner">
                                del Cementerio <input type="text" name="cemetery">
                            </p>
                            <p>
                                Autorizo a <input type="text" name="authorized"> a retirar <input type="text" name="deposit"> de 
                                <input type="text" name="depositOwnerPrefix"> <input type="text" name="depositOwner">,
                            </p>
                            <p>En <input type="text" name="location">, a <input type="text" class="form-control" name="date"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm" id="goRetirar"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>