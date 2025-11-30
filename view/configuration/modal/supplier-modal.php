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
                        <label for="name" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-4 control-label">CIF</label>
                        <div class="col-xs-4">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" style="display: inline-block;" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                        <div class="col-xs-2" style="margin-left:3%">
                            <input type="checkbox" class="minimal" id="validateCIF" name="validateCIF" checked> Validar
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-4 control-label">Dirección</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-4 control-label">E-mail</label>
                        <div class="col-xs-8">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-4 control-label">Provincia</label>
                        <div class="col-xs-8">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-4 control-label">Localidad</label>
                        <div class="col-xs-8">
                            <select id="location" name="location" class="form-control location"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Teléfonos</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <div class="phones"></div>
                            <span class="inputError" id="phoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fax" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="fax" name="fax" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Persona de Contacto</label>
                        <div class="col-xs-8">
                            <div class="input-group input-contactPeople">
                                <input type="text" size="18" class="form-control" id="person" name="person" placeholder="Nombre" autocomplete="none">
                                <input type="text" size="18" class="form-control" id="department" name="department" placeholder="Departamento" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-person" title="Nueva Persona de Contacto">
                                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="contactPeople"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-4 control-label"><span  data-placement="top" title="Productos, marcas...">Descripción</span></label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="3" cols="32" id="description" name="description" autocomplete="none"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Catálogo</label>
                        <div class="col-xs-8">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el proveedor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-xs-4 control-label">Fecha de Entrada</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
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
                                    <input type="checkbox" class="minimal" id="sentObituary" name="sentObituary"> Enviar esquela
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

<div class="modal fade" id="modal-edit-supplier" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Proveedor</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <input type="hidden" id="supplierID" name="supplierID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-4 control-label">Nombre</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-4 control-label">CIF</label>
                        <div class="col-xs-4">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" style="display: inline-block;" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                        <div class="col-xs-2" style="margin-left:3%">
                            <input type="checkbox" class="minimal" id="validateEditCIF" name="validateEditCIF" checked> Validar
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-4 control-label">Dirección</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-4 control-label">E-mail</label>
                        <div class="col-xs-8">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-4 control-label">Provincia</label>
                        <div class="col-xs-8">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-4 control-label">Localidad</label>
                        <div class="col-xs-8">
                            <select id="location" name="location" class="form-control location"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Teléfonos</label>
                        <div class="col-xs-8">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <div class="phones"></div>
                            <span class="inputError" id="phoneError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fax" class="col-xs-4 control-label">Fax</label>
                        <div class="col-xs-8">
                            <input type="text" size="30" min="0" class="form-control" id="fax" name="fax" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-4 control-label">Persona de Contacto</label>
                        <div class="col-xs-8">
                            <div class="input-group input-contactPeople">
                                <input type="text" size="18" class="form-control" id="person" name="person" placeholder="Nombre" autocomplete="none">
                                <input type="text" size="18" class="form-control" id="department" name="department" placeholder="Departamento" autocomplete="none">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-person" title="Nueva Persona de Contacto">
                                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="contactPeople"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description" class="col-xs-4 control-label"><span  data-placement="top" title="Productos, marcas...">Descripción</span></label>
                        <div class="col-xs-8">
                            <textarea class="form-control" rows="3" cols="32" id="description" name="description"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fileupload" class="col-xs-4 control-label">Catálogo</label>
                        <div class="col-xs-8">
                            <span class="btn btn-primary fileinput-button">
                                <i class="fa fa-file-pdf-o c-black" aria-hidden="true"></i>
                                <span>Seleccionar archivo</span>
                                <input id="fileupload" type="file" name="files[]" multiple>
                            </span>
                            <br>
                            <br>
                            <div id="progress" class="progress">
                                <div class="progress-bar progress-bar-info progress-bar-striped"></div>
                            </div>
                            <div id="files" class="files"></div>
                            <div id="catalogue-link"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="entryDate" class="col-xs-4 control-label">Fecha de Entrada</label>
                        <div class="col-xs-8">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="entryDate" name="entryDate" autocomplete="none">
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
                                    <input type="checkbox" class="minimal" id="sentObituary" name="sentObituary"> Enviar esquela
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditSupplier" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>