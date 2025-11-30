<div id="auto-cremacion-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="auto-cremacion-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formAutoCremacion" name="formAutoCremacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/autoCremacion'; ?>" target="_blank">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Auto de <span class="bolder">cremación</span></h4>
                </div>
                <div class="modal-body">
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-7 col-lg-7" for="cadaver">CADAVER</label>
                        <input id="cadaver" name="checkAutoCremacion" type="radio" class="form-check-input col-md-1 col-lg-1" checked="checked" value="cadaver">                                 
                        <label class="form-check-label col-md-7 col-lg-7" for="remains">RESTOS CADAVÉRICOS</label>
                        <input id="remains" name="checkAutoCremacion" type="radio" class="form-check-input col-md-1 col-lg-1"  value="remains">                                  
                        <label class="form-check-label col-md-7 col-lg-7" for="ashes">CENIZAS</label>
                        <input id="ashes" name="checkAutoCremacion" type="radio" class="form-check-input col-md-1 col-lg-1"  value="ashes">
                    </div>
                    <hr class="clearfix">
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-7 col-lg-7" for="pacemaker">PORTADOR MARCAPASOS</label>
                        <input id="pacemaker" type="checkbox" class="form-check-input col-md-1 col-lg-1" name="pacemaker" value="pacemaker">
                        <div class="col-md-4 col-lg-4">
                            <textarea class="form-control" rows="2" id="pacemakerText" placeholder="Observaciones" name="pacemakerText"></textarea>
                        </div>
                    </div>                                        
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" id="autoCremacionCreate" class="btn btn-danger btn-sm"><i class="fa fa-file-pdf-o" aria-hidden="true" onclick="closeModal();"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>