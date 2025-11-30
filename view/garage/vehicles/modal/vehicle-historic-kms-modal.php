<div class="modal fade" id="modal-historic-kms" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Cambio de Kilómetros</span></h4>
            </div>
            <div class="modal-body">  
                <div class="row form-group">
                    <div class="col-xs-6">
                        <label for="kms" class="col-xs-4 control-label">Kilómetros</label>
                        <div class="col-xs-8">
                            <input type="hidden" id="ID-Kms">
                            <input type="number" min="0" id="kms" name="kms" class="form-control" aria-describedby="kms" />
                            <label for="kms" class="label label-danger hide" id="kmsError">Los kilómetros a introducir deben ser mayores que los últimos introducidos</label>
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="col-xs-4" style="margin-left:3%">
                            <button id="saveKms" name="saveKms" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Añadir</button>
                        </div>
                    </div>
                </div>
                <div style="height: 600px; overflow-y: scroll;">
                    <table class="table table-striped table-responsive table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                        <thead>
                            <th class="hide">#</th>
                            <th>Fecha</th>
                            <th>Kilómetros</th>
                        </thead>
                        <tbody id="kmsBody"></tbody>
                    </table>               
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
               
            </div> 
        </div>
    </div>
</div>