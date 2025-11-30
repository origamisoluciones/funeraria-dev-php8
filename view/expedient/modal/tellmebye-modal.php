<div class="modal fade" id="busyEventsModal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Sala / Cámara ocupada</h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning">
                    Las siguientes salas están ocupadas en algún evento de otros servicios.
                    ¿Qué acción deseas realizar? Marca los eventos que quieres que liberen las salas para que se puedan adjudicar a este servicio
                </div>
                <div id="busySection"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="continueNoOverlap" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Continuar</button>
            </div>
        </div>
    </div>
</div>