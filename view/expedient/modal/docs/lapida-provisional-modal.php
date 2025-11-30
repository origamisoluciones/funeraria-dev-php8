<div class="modal fade" id="lapida-provisional-modal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xs" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Lápida provisional</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <input type="hidden" name="expedient" id="expedient" value="<?php echo $expedientID; ?>">
                    <input type="hidden" name="type" id="type" value="0">
                    <label class="radio-inline" for="model0"><input id="model0" type="radio" name="model" value="0" checked>General</label>
                    <label class="radio-inline" for="model1"><input id="model1" type="radio" name="model" value="1">Señores</label>
                    <label class="radio-inline" for="model2"><input id="model2" type="radio" name="model" value="2">Señoras</label>
                    <br><br>
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="click" class="btn btn-primary btn-sm" id="goLapida"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Ir al editor</button>
                </form>
            </div>
        </div>
    </div>
</div>