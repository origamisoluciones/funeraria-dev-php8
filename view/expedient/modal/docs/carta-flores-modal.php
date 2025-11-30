<div id="carta-flores-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="carta-flores-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/cartaFlores'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Carta de <span class="bolder">flores</span></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-4">
                            <label for="attention">A la atención de</label>
                            <input type="text" class="form-control" id="attention">
                        </div>
                        <div class="col-xs-4">
                            <label for="date">Fecha</label>
                            <div class="input-group date">
                                <input type="text" size="15" class="form-control datepicker" id="date" name="date">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label for="deceased">Distinción difunto/a</label>
                            <input type="text" class="form-control" id="deceased">
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-xs-12">
                            <h5>Coronas <button type="button" class="btn btn-default floresButtonModal" id="setMoreCoronas"><i class="fa fa-plus"></i></button></h5>
                            <hr>
                            <div id="currentCoronas"></div>
                            <div id="moreCoronas"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <h5>Centros <button type="button" class="btn btn-default floresButtonModal" id="setMoreCentros"><i class="fa fa-plus"></i></button></h5>
                            <hr>
                            <div id="currentCentros"></div>
                            <div id="moreCentros"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <h5>Otras composiciones <button type="button" class="btn btn-default floresButtonModal" id="setMoreRamos"><i class="fa fa-plus"></i></button></h5>
                            <hr>
                            <div id="currentRamos"></div>
                            <div id="moreRamos"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm" id="goCartaFlores"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>