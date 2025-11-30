<div class="modal fade" id="libro-visitas-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xs" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Libro de Visitas</h4>
            </div>
            <div class="modal-body">
            <form class="form-horizontal" id="formLibroVisitas" name="formLibroVisitas" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/libroVisitas'; ?>">
                <input type="hidden" name="expedient" id="expedient" value="<?php echo $expedientID; ?>">
                <label class="radio-inline" for="general">
                    <input id="general" type="radio" name="model" value="0" checked>General
                </label>
                <label class="radio-inline" for="señores">
                    <input id="señores" type="radio" name="model" value="1">Señores
                </label>
                <label class="radio-inline" for="señoras">
                    <input id="señoras" type="radio" name="model" value="2">Señoras
                </label>
                <label class="radio-inline" for="imagen">
                    <input id="imagen" type="radio" name="model" value="3">Sin imagen
                </label>
                <br><br>
                <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button type="click" class="btn btn-primary btn-sm"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Ir al editor</button>
            </form>
            </div>
        </div>
    </div>
</div>