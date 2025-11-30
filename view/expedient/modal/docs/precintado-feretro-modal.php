<div id="precintado-feretro-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="precintado-feretro-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/precintadoFeretro'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Precintado de féretro</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <p><input type="text" name="health"></p>
                            <p><input type="text" name="healthLocation"></p>
                            <p>
                                <input type="text" name="applicantName"> con D.N.I. <input type="text" name="applicantDni"> y con domicilio
                                <input type="text" name="applicantLocation"> en representación de <input type="text" name="client">, declara:
                            </p>
                            <p>
                                Que previos los trámites legales sobre el traslado de cadáveres, se ha procedido a depositar el cuerpo de ...
                                en un vaso de Cinc, con filtro depurador, sellado hermético y a continuación, éste, en un ataúd de madera, para poder proceder al traslado hacia
                                <input type="text" name="moveTo">, cumpliendo en todo momento con las normas sanitarias en vigor.
                            </p>
                            <p>
                                En <input type="text" name="location">, ...
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm" id="goPrecintado"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>