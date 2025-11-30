<div id="traslado-cenizas-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="traslado-cenizas-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/trasladoCenizasCadaver'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Traslado de cenizas y cadáveres</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <p>
                                <input type="text" name="applicantPrefix"> <input type="text" name="applicantName">, con N.I.F. 
                                <input type="text" name="applicantNif"> y domicilio <input type="text" name="applicantAddress"> en calidad de
                                <input type="text" name="applicantQualityOf">
                            </p>
                            <p class="text-center">EXPONE</p>
                            <p>Que desea proceder al traslado de <input type="text" name="movePrefix"> <input type="text" name="moveName"></p>
                            <p>
                                <select class="form-control" name="moveType">
                                    <option value="1">Cadáver</option>
                                    <option value="2">Restos cadavéricos</option>
                                </select>
                            </p>
                            <p>Fallecido el día <input type="text" name="deceasedDate"></p>
                            <p>desde el Cementerio <input type="text" name="cemetery">, ayuntamiento de <input type="text" name="cemeteryLocation"></p>
                            <p>sepultura nº <input type="text" name="sepultureNumber"></p>
                            <p>al Cementerio de <input type="text" name="destination"> de destino, <input type="text" name="destinationLocation"></p>
                            <p>Para el cual adjunto la documentación necesaria, y SOLICITA</p>
                            <p>La concesión de la correspondiente autorización sanitaria, de conformidad con la legislación vigente.</p>
                            <p>SECCIÓN DE SANIDAD AMBIENTAL</p>
                            <p>Delegación Provincial de Sanidad</p>
                            <p><input type="text" name="delegation"></p>
                            <p>En <input type="text" name="location">, a <input type="text" name="date"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm" id="goTrasladoCenizas"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>