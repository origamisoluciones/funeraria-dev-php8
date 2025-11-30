<div class="modal fade" id="modal-docs-vehicles" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Documentación del vehículo <span id="licenseShowDoc" class="bolder"></span></h4>
            </div>
            <div class="modal-body">                
                <div id="docs" name="docs"></div>
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Documentos</span></legend>
                    <div class="clearfix table-responsive">
                        <table id="listDocs" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th class="hide"></th>
                                    <th class="centered">#</th>
                                    <th style="width:400px" class="centered">Documento</th>
                                    <th class="centered">Descargar</th>                        
                                    <th class="centered">Eliminar</th>                        
                                </tr>
                            </thead>
                            <tbody id="tableBody"></tbody>
                        </table>
                    </div>
                </fieldset>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div> 
        </div>
    </div>
</div>