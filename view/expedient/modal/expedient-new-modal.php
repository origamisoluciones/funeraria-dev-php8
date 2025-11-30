<div class="modal fade" id="modal-new-church" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Iglesia Parroquial</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewChurch" name="formNewChurch">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Iglesia</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Dirección</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="address" name="address">
                            <span class="inputError" id="addressError"></span>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label for="province" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label" disabled>Localidad</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="location" name="location" class="form-control location"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Latitud</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" class="form-control" id="latitude" name="latitude">
                            <span class="inputError" id="latitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Longitud</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="number" class="form-control" id="longitude" name="longitude">
                            <span class="inputError" id="longitudeError"></span>
                        </div>
                    </div>
                    <div class="situation-link clearfix">
                        <div class="text-center">
                            <a target="_blank" href="https://google.es/maps/search/?api=1&query=" target="_blank"><i class="fa fa-map-marker c-blue" aria-hidden="true"></i> Ver situación en <span class="bolder">Google Maps</span></a>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Teléfonos</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <input type="text"  size="30" class="form-control phone" id="phone" name="phone">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <span class="inputError" id="phoneError"></span>
                            <div class="phones"></div>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Curas</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <select id="priest" name="priest" class="form-control priest"></select>
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-priest" title="Añadir cura">
                                        <i class="fa fa-plus"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="priests"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewChurch" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-deceased" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Nuevo <span class="bolder">Fallecido En</span></h4>
      </div>
      <div class="modal-body">
        <form class="form-horizontal" id="formNewDeceased" name="formNewDeceased">
            <div class="form-group">
                <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre</label>
                <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                    <input type="text" size="30" class="form-control" id="name" name="name">
                    <span class="inputError" id="nameError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="province" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                    <select id="province" name="province" class="form-control province"></select>
                </div>
            </div>
            <div class="form-group">
                <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                    <select id="location" name="location" class="form-control location" disabled></select>
                    <span class="inputError" id="locationError"></span>
                </div>
            </div>
            <div class="form-group hide">
                <div class="col-lg-offset-4 col-lg-8 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-12 col-xs-12">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" class="minimal" id="text" name="text"> Texto
                        </label>
                    </div>
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewDeceasedIn" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modal-new-cemetery" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Nuevo <span class="bolder">Cementerio</span></h4>
      </div>
      <div class="modal-body">
        <form class="form-horizontal" id="formNewCemetery" name="formNewCemetery">
            <div class="form-group">
                <label for="name" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Cementerio</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="text" size="30" class="form-control" id="name" name="name">
                    <span class="inputError" id="nameError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="address" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Dirección</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="text" size="30" class="form-control" id="address" name="address">
                    <span class="inputError" id="addressError"></span>
                </div>
            </div>
            <hr>
            <div class="form-group">
                <label for="province" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    <select id="province" name="province" class="form-control province"></select>
                </div>
            </div>
            <div class="form-group">
                <label for="location" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    <select id="location" name="location" class="form-control location" disabled></select>
                    <span class="inputError" id="locationError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="location" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Latitud</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="number" class="form-control" id="latitude" name="latitude">
                    <span class="inputError" id="latitudeError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="location" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Longitud</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="number" class="form-control" id="longitude" name="longitude">
                    <span class="inputError" id="longitudeError"></span>
                </div>
            </div>
            <div class="situation-link clearfix">
                <div class="text-center">
                    <a target="_blank" href="https://google.es/maps/search/?api=1&query=" target="_blank"><i class="fa fa-map-marker c-blue" aria-hidden="true"></i> Ver situación en <span class="bolder">Google Maps</span></a>
                </div>
            </div>
            <hr>
            <div class="form-group">
                <label for="mail" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">E-mail</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="email" size="30" class="form-control" id="mail" name="mail">
                </div>
            </div>
            <div class="form-group">
                <label class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Teléfonos</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <div class="input-group">
                        <input type="text" size="30" class="form-control phone" id="phone" name="phone">
                        <span class="input-group-addon">
                            <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                <i class="fa fa-plus"> </i> AÑADIR
                            </a>
                        </span>
                    </div>
                    <div class="phones"></div>
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewCemetery" name="saveNewCemetery" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div>       
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modal-new-crematorium" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Nuevo <span class="bolder">Crematorio</span></h4>
      </div>
      <div class="modal-body">
        <form class="form-horizontal" id="formNewCrematorium" name="formNewCrematorium">
            <div class="form-group">
                <label for="name" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Nombre</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="text" size="30" class="form-control" id="name" name="name">
                    <span class="inputError" id="nameError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="address" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Dirección</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="text" size="30" class="form-control" id="address" name="address">
                    <span class="inputError" id="addressError"></span>
                </div>
            </div>
            <hr>
            <div class="form-group">
                <label for="province" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    <select id="province" name="province" class="form-control province"></select>
                </div>
            </div>
            <div class="form-group">
                <label for="location" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    <select id="location" name="location" class="form-control location"></select>
                    <span class="inputError" id="locationError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="latitude" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Latitud</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="number" class="form-control" id="latitude" name="latitude">
                    <span class="inputError" id="latitudeError"></span>
                </div>
            </div>
            <div class="form-group">
                <label for="longitude" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Longitud</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="number" class="form-control" id="longitude" name="longitude">
                    <span class="inputError" id="longitudeError"></span>
                </div>
            </div>
            <div class="situation-link clearfix">
                <div class="text-center">
                    <a target="_blank" href="https://google.es/maps/search/?api=1&query=" target="_blank"><i class="fa fa-map-marker c-blue" aria-hidden="true"></i> Ver situación en <span class="bolder">Google Maps</span></a>
                </div>
            </div>
            <hr>                    
            <div class="form-group">
                <label for="mail" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">E-mail</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <input type="email" size="30" class="form-control" id="mail" name="mail">
                </div>
            </div>
            <div class="form-group">
                <label class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label">Teléfonos</label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <div class="input-group">
                        <input type="text" size="30" class="form-control phone" id="phone" name="phone">
                        <span class="input-group-addon">
                            <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                <i class="fa fa-plus"> </i> AÑADIR
                            </a>
                        </span>
                    </div>
                    <div class="phones"></div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-lg-4 col-md-4 col-sm-4 col-xs-12 control-label"> Propio </label>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <div class="checkbox">
                        <input type="checkbox" id="isYourOwn" name="isYourOwn">                         
                    </div>
                </div>
            </div>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button id="saveNewCrematorium" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modal-new-client" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Cliente</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewClient" name="formNewClient">
                <div id="msg"></div>
                    <div class="form-group">
                        <label for="brandName" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre comercial</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" size="30" id="brandName" name="brandName">
                            <span class="inputError" id="brandNameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" size="30" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="surname" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Apellidos</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" size="30" id="surname" name="surname">
                            <span class="inputError" id="surnameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="authNifType" class="col-xs-6 control-label toNormal" style="margin-left: 4em;">
                            <input type="radio" name="authNifType" id="authNifType1" value="1" checked> NIF
                            <input type="radio" name="authNifType" id="authNifType2" value="2"> NIE
                            <input type="radio" name="authNifType" id="authNifType3" value="3"> Pasaporte
                            <input type="radio" name="authNifType" id="authNifType4" value="4"> Otro
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">NIF</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control autocompleteNif" size="30" id="nif" name="nif">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">E-mail</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="email" class="form-control" size="30" id="mail" name="mail">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Teléfonos</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <input type="text" class="form-control phone" size="30" id="phone" name="phone">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-phone" title="Añadir Teléfono">
                                        <i class="fa fa-plus"> </i> AÑADIR
                                    </a>
                                </span>
                            </div>
                            <span class="inputError" id="phoneError"></span>
                            <div class="phones"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Dirección</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" size="30" id="address" name="address">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="location" name="location" class="form-control location" disabled></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Tipo</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select class="form-control select2-no-clear" id="type" name="type">
                                <!-- <option value="1">Particular</option>
                                <option value="2">Seguros</option>
                                <option value="3">Empresa</option> -->
                            </select>
                        </div>
                    </div>
                    <div class="form-group hide" id="prices">
                        <label for="price" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Tarifa</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="price" name="price" class="form-control"></select>
                            <span class="inputError" id="priceError"></span>
                        </div>
                    </div>
                    <div id="obituaryAnniversaryReminderSection" class="form-group hide">
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
                    <div class="form-group">
                        <div class="col-xs-12 text-center">
                            <button type="button" class="btn btn-default" id="loadApplicant">Cargar datos del solicitante</button>
                            <button type="button" class="btn btn-default" id="loadFamilyContact">Cargar datos del contratante</button>
                            <button type="button" class="btn btn-default" id="loadDeceased">Cargar datos del difunto</button>
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

<div class="modal fade" id="modal-new-deceasedBirthdayLocation" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Localidad</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDeceasedBirthayLocation" name="formNewDeceasedBirthayLocation">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-4 col-xs-12 control-label">Localidad</label>
                        <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="postalCode" class="col-lg-3 col-md-4 col-sm-4 col-xs-12 control-label">Código Postal</label>
                        <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                            <input type="number" min="0" class="form-control" id="postalCode" name="postalCode">
                            <span class="inputError" id="postalCodeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-lg-3 col-md-4 col-sm-4 col-xs-12 control-label">Provincia</label>
                        <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" size="30" class="form-control" id="province" name="province">
                            <span class="inputError" id="provinceError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDeceasedBirthdayLocation" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-deceasedDoctor" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Médico</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDeceasedDoctor" name="formNewDeceasedDoctor">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-4 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="college" class="col-lg-3 col-md-4 col-sm-4 col-xs-12 control-label">Colegiado</label>
                        <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                            <input type="text"size="30" class="form-control" id="college" name="college">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email" class="col-lg-3 col-md-4 col-sm-4 col-xs-12 control-label">Email</label>
                        <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                            <input type="text"size="30" class="form-control" id="email" name="email">
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDoctor" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-mortuary" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Tanatorio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewMortuary" name="formNewMortuary">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address">
                            <span class="inputError" id="addressError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="email" name="email">
                            <span class="inputError" id="emailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone">
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
                        <label for="company" class="col-xs-3 control-label">Compañía</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="company" name="company">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="latitude" class="col-xs-3 control-label">Latitud</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" class="form-control" id="latitude" name="latitude" autocomplete="none">
                            <span class="inputError" id="latitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="longitude" class="col-xs-3 control-label">Longitud</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" class="form-control" id="longitude" name="longitude" autocomplete="none">
                            <span class="inputError" id="longitudeError"></span>
                        </div>
                    </div>
                    <div class="form-group situation-link clearfix">
                        <div class="col-xs-offset-3 col-xs-9">
                            <a id="goToMaps" target="_blank" style="cursor:pointer"><i class="fa fa-map-marker c-blue" aria-hidden="true"></i> Ver situación en <span class="bolder">Google Maps</span></a>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-offset-3 col-xs-9">
                            <label class="checkbox-inline">
                                <input type="checkbox" id="isYourOwn" name="isYourOwn"> Propio
                            </label>
                            <label class="checkbox-inline hide">
                                <input type="checkbox" id="text" name="text"> Texto
                            </label>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <div class="col-xs-offset-1 col-xs-6">
                            <h4 class="modal-title">Configuración API <span class="bolder">Vivo Recuerdo</span></h4>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="apiClient" class="col-xs-3 control-label">CLIENT KEY</label>
                        <div class="col-xs-9">
                            <input type="text" size="50" class="form-control" id="apiClient" name="apiClient">
                            <span class="inputError" id="apiClientError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="apiKey" class="col-xs-3 control-label">SECRET KEY</label>
                        <div class="col-xs-9">
                            <input type="text" size="50" class="form-control" id="apiKey" name="apiKey">
                            <span class="inputError" id="apiKeyError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewMortuary" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-funeralHome" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Funeraria</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewFuneralHome" name="formNewFuneralHome">
                    <div id="msg"></div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Funeraria</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address" class="col-xs-3 control-label">Dirección</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="address" name="address">
                            <span class="inputError" id="addressError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nif" class="col-xs-3 control-label">CIF</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="nif" name="nif" class="autocompleteNif">
                            <span class="inputError" id="nifError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-xs-3 control-label">Provincia</label>
                        <div class="col-xs-9">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-xs-3 control-label">Localidad</label>
                        <div class="col-xs-9">
                            <select id="location" name="location" class="form-control location"></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mail" class="col-xs-3 control-label">E-mail</label>
                        <div class="col-xs-9">
                            <input type="email" size="30" class="form-control" id="mail" name="mail">
                            <span class="inputError" id="mailError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Teléfonos</label>
                        <div class="col-xs-9">
                            <div class="input-group">
                                <input type="text" size="30" class="form-control phone" id="phone" name="phone">
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
                        <label for="fax" class="col-xs-3 control-label">Fax</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="fax" name="fax">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Persona de Contacto</label>
                        <div class="col-xs-9">
                            <div class="input-group input-contactPeople">
                                <input type="text" size="18" class="form-control" id="person" name="person" placeholder="Nombre">
                                <input type="text" size="18" class="form-control" id="post" name="post" placeholder="Cargo">
                                <span class="input-group-addon">
                                    <a href="#" class="btn-add-person" title="Nueva Persona de Contacto">
                                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="contactPeople"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewFuneralHome" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div style="margin-top: 4%" class="modal fade" id="modal-coverted-contado-warning" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Aviso <span class="bolder"> conversión</span></h4>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <p class="c-red"><strong>No es posible convertir el presupuesto a <strong><span id="typeConverted"></span></strong> ya que la contratación es superior a 400€ y no se ha identificado al cliente.</strong></p>
                    <p id="message">Para realizar la conversión debes identificar al cliente o reducir la contratación a menos de 400€.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-destinationPlaceMiddle" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Lugar de Destino Intermedio</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDestinationPlaceMiddle" name="formNewDestinationPlaceMiddle">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="location" name="location" class="form-control location" disabled></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDestinationPlace" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>    
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-destinationPlaceFinal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Lugar de Destino Final</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDestinationPlaceFinal" name="formNewDestinationPlaceFinal">
                    <div class="form-group">
                        <label for="name" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Nombre</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <input type="text" size="30" class="form-control" id="name" name="name">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="province" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Provincia</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="province" name="province" class="form-control province"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location" class="col-lg-3 col-md-4 col-sm-12 col-xs-12 control-label">Localidad</label>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <select id="location" name="location" class="form-control location" disabled></select>
                            <span class="inputError" id="locationError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDestinationPlaceFinal" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>    
        </div>
    </div>
</div>

<div class="modal fade" id="previewImageModal" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span class="modal-exit" aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body text-center">
                <img class="img-responsive" style="display:initial" id="previewImage">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-change-cliente-warning" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span class="modal-exit" aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">Aviso <span class="bolder">cambio de cliente</span></h4>
            </div>
            <div class="modal-body text-center">
                <div class="text-center">
                    <p class="c-red"><strong>No es posible modificar el cliente de este expediente ya que existe una factura generada.</strong></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>