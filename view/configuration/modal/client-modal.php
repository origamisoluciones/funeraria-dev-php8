<div class="modal fade" id="modal-new-client" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Cliente</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div id="msg"></div>
                    <div class="form-group">
                        <label for="brandName" class="col-xs-3 control-label">Nombre comercial</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="brandName" name="brandName" autocomplete="none">
                            <span class="inputError" id="brandNameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname" autocomplete="none">
                            <span class="inputError" id="surnameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="authNifType" class="col-xs-6 control-label toNormal" style="margin-left: 4em;">
                            <input type="radio" name="authNifType" value="1" checked> NIF
                            <input type="radio" name="authNifType" value="2"> NIE
                            <input type="radio" name="authNifType" value="3"> Pasaporte
                            <input type="radio" name="authNifType" value="4"> Otro
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
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
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group form-group-location">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-xs-3 control-label">Tipo</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="type" name="type">
                                <option value="1">Particular</option>
                                <option value="2">Seguros</option>
                                <option value="3">Empresa</option>
                            </select>
                            <br>
                            <span class="inputError" id="typeError"></span>
                        </div>
                    </div>
                    <div class="form-group hide" id="prices">
                        <label for="price" class="col-xs-3 control-label">Tarifa</label>
                        <div class="col-xs-9">
                            <select id="price" name="price" class="form-control"></select>
                            <span class="inputError" id="priceError"></span>
                        </div>
                    </div>
                    <div id="obituaryAnniversaryReminderCreateSection" class="form-group hide">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="obituaryAnniversaryReminder" name="obituaryAnniversaryReminder"> Generar recordatorio de esquela de aniversario
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="protocol" class="col-xs-3 control-label">Protocolo de facturación</label>
                        <div class="col-xs-9">
                            <textarea type="text" class="form-control" id="protocol" rows="15" cols="60"></textarea>
                            <span class="inputError" id="protocolError"></span>
                        </div>
                    </div>
                    <div class="form-group" style="display: flex;align-items: center;">
                        <label for="fileupload" class="col-xs-3 control-label" style="padding-bottom: 0.75em;">Documentación</label>
                        <div class="col-xs-8">
                            <div class="alert alert-info">
                                <ul class="margin-bottom-none padding-left-lg">
                                    <li>Primero debe guardar el cliente</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewClient" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-client" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Cliente</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <input type="hidden" id="clientID" name="clientID" value="">
                    <input type="hidden" id="priceID" name="priceID" value="">
                    <div class="form-group">
                        <label for="brandName" class="col-xs-3 control-label">Nombre comercial</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="brandName" name="brandName" autocomplete="none">
                            <span class="inputError" id="brandNameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-xs-3 control-label">Apellidos</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="surname" name="surname" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-6 control-label toNormal" style="margin-left: 4em;">
                            <input type="radio" name="authNifTypeEdit" id="authNifTypeEdit1" value="1" checked> NIF
                            <input type="radio" name="authNifTypeEdit" id="authNifTypeEdit2" value="2"> NIE
                            <input type="radio" name="authNifTypeEdit" id="authNifTypeEdit3" value="3"> Pasaporte
                            <input type="radio" name="authNifTypeEdit" id="authNifTypeEdit4" value="4"> Otro
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">NIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif" autocomplete="none">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail" autocomplete="none">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
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
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address" autocomplete="none">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group form-group-location">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-xs-3 control-label">Tipo</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="type" name="type">
                                <option value="1">Particular</option>
                                <option value="2">Seguros</option>
                                <option value="3">Empresa</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group hide" id="prices">
                        <label for="price" class="col-xs-3 control-label">Tarifa</label>
                        <div class="col-xs-9">
                            <select id="price" name="price" class="form-control"></select>
                            <span class="inputError" id="priceError"></span>
                        </div>
                    </div>
                    <div id="obituaryAnniversaryReminderEditSection" class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" class="minimal" id="obituaryAnniversaryReminder" name="obituaryAnniversaryReminder"> Generar recordatorio de esquela de aniversario
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="protocol" class="col-xs-3 control-label">Protocolo de facturación</label>
                        <div class="col-xs-9">
                            <textarea type="text" class="form-control" id="protocol" rows="15" cols="60"></textarea>
                            <span class="inputError" id="protocolError"></span>
                        </div>
                    </div>
                    <div class="form-group" style="display: flex;align-items: center;">
                        <label for="fileupload" class="col-xs-3 control-label" style="padding-bottom: 0.75em;">Documentación</label>
                        <div class="col-xs-8">
                            <span class="btn btn-primary fileinput-button" id="fileuploadLbl">
                                <i class="fa fa-file-pdf-o c-black" aria-hidden="true"></i>
                                <span>Seleccionar archivo</span>
                            </span>
                            <input id="fileupload" type="file" name="files[]" multiple class="hide">
                            <br>
                            <br>
                            <div id="progress" class="progress">
                                <div class="progress-bar progress-bar-info progress-bar-striped"></div>
                            </div>
                            <div id="files" class="files"></div>
                            <div id="doc-link"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditClient" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-survey" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Cuestionarios de satisfacción</span></h4>
            </div>
            <div class="modal-body">
                <div class="row" id="newSurveySection">
                    <div class="col-xs-12">
                        <div class="form-group">
                            <button type="button" class="btn btn-primary" id="newSurvey">Crear encuesta año <span id="currentYear"></span></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <div class="clearfix table-responsive">
                            <table id="surveys" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Año</th>
                                        <th width="5%" class="text-center">Ver encuesta</th>
                                        <th width="5%" class="text-center">Cubrir encuesta</th>
                                    </tr>
                                </thead>
                                <tbody id="surveysBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-survey" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="overflow-x: visible;">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Cuestionario de satisfacción <span class="bolder" id="surveyYear"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Valoración de servicios</th>
                                        <th class="text-center">Excelente (5)</th>
                                        <th class="text-center">Buena (4)</th>
                                        <th class="text-center">Regular (3)</th>
                                        <th class="text-center">Mala (2)</th>
                                        <th class="text-center">Muy mala (1)</th>
                                        <th class="text-center">No aplica</th>
                                        <th width="20%"class="text-center">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody id="surveyBody"></tbody>
                            </table>
                            <strong>Puntuación total</strong>: <span id="totalScore"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <ol>
                            <li class="bolder">En caso de que la valoración sea regular, mala o muy mala, solicitar explicación de que aspectos deberíamos mejorar.</li>
                            <li class="bolder">En cualquier caso y aún valorando bien nuestro servicio, si consideran que existen aspectos que deberíamos mejorar, relacionarlos a continuación.</li>
                        </ol>
                        <textarea class="form-control" id="notes" rows="6" cols="100"></textarea>
                        <br>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveSurvey" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div>
        </div>
    </div>
</div>
