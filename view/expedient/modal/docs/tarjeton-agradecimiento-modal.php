<div class="modal fade" id="tarjeton-agradecimiento-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xs" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Tarjetón de <span class="bolder">agradecimiento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formAutoCremacion" name="formAutoCremacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/tarjetonAgradecimiento'; ?>">
                    <textarea class="form-control" name="text" id="text" cols="60" rows="4">
                        Le dan las más expresivas gracias por la asistencia al funeral de aniversario, por manifestar su condolencia y por haber orado por su eterno descanso.
                    </textarea>
                    <br><br>
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
                </form>
            </div>
        </div>
    </div>
</div>