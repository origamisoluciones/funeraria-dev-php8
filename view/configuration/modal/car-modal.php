<div class="modal fade" id="modal-new-car" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Coche</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData" action="" method="post">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="name" name="name" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="brand" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Marca</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="brand" name="brand" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="model" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Modelo</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="model" name="model" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chassis" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Chasis</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="chassis" name="chassis" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="licensePlate" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Matrícula</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="licensePlate" name="licensePlate" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-3 col-lg-9 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-12 col-xs-12">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="isForService" name="isForService"> Servicio pendiente de revisión
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewCar" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-car" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Coche</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData" action="" method="post">
                    <input type="hidden" id="carID" name="carID" value="">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="name" name="name" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="brand" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Marca</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="brand" name="brand" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="model" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Modelo</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="model" name="model" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chassis" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Chasis</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="chassis" name="chassis" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="licensePlate" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Matrícula</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="licensePlate" name="licensePlate" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-3 col-lg-9 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-12 col-xs-12">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="isForService" name="isForService"> Servicio pendiente de revisión
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="saveEditCar"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>