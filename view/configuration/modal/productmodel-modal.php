<div class="modal fade" id="modal-new-model" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Modelo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-4 control-label">Modelo</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplierReference" class="col-xs-4 control-label">Referencia proveedor</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="supplierReference" autocomplete="none">
                            <span class="inputError" id="supplierReferenceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lastPurchasePrice" class="col-xs-4 control-label">Precio de compra (año anterior)</label>
                        <div class="col-xs-8">
                            <input type="number" size="30" min="0" class="form-control" id="lastPurchasePrice" name="lastPurchasePrice" autocomplete="none" disabled>
                            <span class="inputError" id="lastPurchasePriceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="purchasePrice" class="col-xs-4 control-label">Precio de compra</label>
                        <div class="col-xs-8">
                            <input type="number" size="30" min="0" class="form-control" id="purchasePrice" name="purchasePrice" autocomplete="none">
                            <span class="inputError" id="purchasePriceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplier" class="col-xs-4 control-label">Proveedor</label>
                        <div class="input-group" style="padding-left: 2.5%;">
                            <select id="supplier" name="supplier" class="form-control"></select>
                            <div id="addSupplier" class="input-group-addon" style="cursor:pointer">+</div>
                        </div>
                        <span class="col-xs-4"></span>
                        <span class="col-xs-4 inputError" id="supplierError"></span>
                    </div>
                    <div class="form-group">
                        <label for="year" class="col-xs-4 control-label">Año</label>
                        <div class="col-xs-8">
                            <input type="number" size="30" min="0" class="form-control" id="year" name="year" autocomplete="none" disabled>
                            <span class="inputError" id="yearError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <label class="col-xs-4 control-label">Visible en contratación</label>
                            <div class="col-xs-8">
                                <input type="checkbox" id="visibleHiring" name="visibleHiring" checked>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Imagen</label>
                        <div class="col-xs-6">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el modelo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Tarifas asociadas</span></legend>
                        <div class="prices"></div>
                    </fieldset>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewModel" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-model" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Modelo</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="model" name="model" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-4 control-label">Modelo</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplierReference" class="col-xs-4 control-label">Referencia proveedor</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="supplierReference" autocomplete="none">
                            <span class="inputError" id="supplierReferenceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lastPurchasePrice" class="col-xs-4 control-label">Precio de compra (año anterior)</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="number" size="30" min="0" class="form-control" id="lastPurchasePrice" name="lastPurchasePrice" autocomplete="none" disabled>
                                <div class="input-group-addon">€</div>
                            </div>
                            <span class="inputError" id="lastPurchasePriceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="purchasePrice" class="col-xs-4 control-label">Precio de compra</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="number" size="30" min="0" class="form-control" id="purchasePrice" name="purchasePrice" autocomplete="none">
                                <div class="input-group-addon">€</div>
                            </div>
                            <span class="inputError" id="purchasePriceError"></span>
                        </div>
                    </div>
                    <div class="form-group hide" id="nextPurchasePriceSection">
                        <label for="nextPurchasePrice" class="col-xs-4 control-label">Precio de compra (año siguiente)</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="number" size="30" min="0" class="form-control" id="nextPurchasePrice" name="nextPurchasePrice" autocomplete="none">
                                <div class="input-group-addon">€</div>
                            </div>
                            <span class="inputError" id="nextPurchasePriceError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplier" class="col-xs-4 control-label">Proveedor</label>
                        <div class="col-xs-8">
                            <select id="supplier" name="supplier" class="form-control"></select>
                        </div>
                        <span class="col-xs-4"></span>
                        <span class="col-xs-4 inputError" id="supplierError"></span>
                    </div>
                    <div class="form-group">
                        <label for="year" class="col-xs-4 control-label">Año</label>
                        <div class="col-xs-8">
                            <input type="number" size="30" min="0" class="form-control" id="year" name="year" autocomplete="none" disabled>
                            <span class="inputError" id="yearError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <label class="col-xs-4 control-label">Visible en contratación</label>
                            <div class="col-xs-8">
                                <input type="checkbox" id="visibleHiring" name="visibleHiring">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Imagen</label>
                        <div class="col-xs-8">
                            <span class="btn btn-primary fileinput-button">
                                <i class="fa fa-file-pdf-o c-black" aria-hidden="true"></i>
                                <span>Seleccionar imagen</span>
                                <input id="fileupload" type="file" name="files[]" multiple>
                            </span>
                            <br><br>
                            <div id="progress" class="progress">
                                <div class="progress-bar progress-bar-info progress-bar-striped"></div>
                            </div>
                            <div id="files" class="files"></div>
                        </div>
                    </div>
                    <div class="form-group" style="text-align:center" id="productImgDiv">
                        <div class="col-xs-3"></div>
                        <div class=" col-xs-6">
                            <img class="cursor-pointer img-responsive" id="productImg" >
                            <div id="catalogue-link" class="hide"></div>
                        </div>
                        <div class="col-xs-3"></div>
                    </div>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Tarifas asociadas</span></legend>
                        <div class="prices"></div>
                    </fieldset>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditModel" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-supplier" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Proveedor</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData" enctype="multipart/form-data">
                <div id="msg"></div>
                    <div class="form-group">
                        <label for="nameSupplier" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="nameSupplier" name="nameSupplier" autocomplete="none">
                            <span class="inputError" id="nameSupplierError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nifSupplier" class="col-xs-4 control-label">CIF</label>
                        <div class="col-xs-4">
                            <input type="text" size="30" class="form-control" id="nifSupplier" name="nifSupplier" class="autocompleteNif" style="display: inline-block;" autocomplete="none">
                            <span class="inputError" id="nifSupplierError"></span>
                        </div>
                        <div class="col-xs-2" style="margin-left:3%">
                            <input type="checkbox" class="minimal" id="validateCIF" name="validateCIF" checked> Validar
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="addressSupplier" class="col-xs-4 control-label">Dirección</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="addressSupplier" name="addressSupplier" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mailSupplier" class="col-xs-4 control-label">E-mail</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="mailSupplier" name="mailSupplier" autocomplete="none">
                            <span class="inputError" id="mailSupplierError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="provinceSupplier" class="col-xs-4 control-label">Provincia</label>
                        <div class="col-xs-8">
                            <select id="provinceSupplier" name="provinceSupplier" class="form-control provinceSupplier"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="locationSupplier" class="col-xs-4 control-label">Localidad</label>
                        <div class="col-xs-8">
                            <select id="locationSupplier" name="locationSupplier" class="form-control locationSupplier"></select>
                            <span class="inputError" id="locationSupplierError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Teléfonos</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phoneSupplier" name="phoneSupplier" autocomplete="none">
                                <span class="input-group-addon">
                                    <a style="cursor:pointer" class="btn-add-phoneSupplier" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <div class="phonesSupplier"></div>
                            <span class="inputError" id="phoneSupplierError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="faxSupplier" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="faxSupplier" name="faxSupplier" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Persona de Contacto</label>
                        <div class="col-xs-8">
                            <div class="input-group input-contactPeople">
                                <input type="text" size="18" class="form-control" id="personSupplier" name="personSupplier" placeholder="Nombre" autocomplete="none">
                                <input type="text" size="18" class="form-control" id="departmentSupplier" name="departmentSupplier" placeholder="Departamento" autocomplete="none">
                                <span class="input-group-addon">
                                    <a style="cursor:pointer" class="btn-add-personSupplier" title="Nueva Persona de Contacto">
                                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="contactPeopleSupplier"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="descriptionSupplier" class="col-xs-4 control-label"><span  data-placement="top" title="Productos, marcas...">Descripción</span></label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="3" cols="32" id="descriptionSupplier" name="descriptionSupplier"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Catálogo</label>
                        <div class="col-xs-6">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el proveedor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDateSupplier" class="col-xs-4 control-label">Fecha de Entrada</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="entryDateSupplier" name="entryDateSupplier" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style="margin-left:37%" class="col-lg-offset-3 col-lg-9 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-12 col-xs-12">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="sentObituarySupplier" name="sentObituarySupplier"> Enviar esquela
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewSupplier" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-info-product-type" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Información <span class="bolder">Tipo de Producto</span></h4>
            </div>
            <div class="modal-body">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Tipos de producto (Pedidos)</legend>
                    <p>- <strong>Producto relativo al expediente:</strong> Estos productos aparecen en la contratación del servicio.</p>
                    <p>- <strong>Producto libre:</strong> Productos ajenos al servicio.</p>
                    <p>- <strong>Producto del control de visitas:</strong> Productos principalmente de cafetería que aparecen en el Control de Visitas.</p>
                    <p>- <strong>Producto del control de servicio:</strong> Productos que aparecen en el Control de Servicio.</p>
                </fieldset>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-info-product-type-orders" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Información <span class="bolder">Tipo de producto (Pedidos)</span></h4>
            </div>
            <div class="modal-body">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Tipos de producto (Pedidos)</legend>
                    <p>- <strong>Producto relativo al expediente:</strong> Estos productos aparecen en la contratación del servicio.</p>
                    <p>- <strong>Producto libre:</strong> Productos ajenos al servicio.</p>
                    <p>- <strong>Producto del control de visitas:</strong> Productos principalmente de cafetería que aparecen en el Control de Visitas.</p>
                    <p>- <strong>Producto del control de servicio:</strong> Productos que aparecen en el Control de Servicio.</p>
                </fieldset>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>