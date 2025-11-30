<div class="modal fade" id="modal-edit-event" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Cremación</span> <span id="numExp"></span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="eventID" name="eventID" value="">
                    <input type="hidden" id="expedientID" name="expedientID" value="">
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Cremación</span></legend>
                        <div class="form-group">
                            <div class="col-xs-3">
                                <label for="crematoriumEdit" class="col-xs-5 control-label">Crematorio</label>
                                <div class="col-xs-6">
                                    <select class="form-control crematorium" id="crematoriumEdit" name="crematoriumEdit"></select>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <label for="crematoriumTechnical" class="col-xs-5 control-label">Técnico cremación</label>
                                <div class="col-xs-6">
                                    <select class="form-control crematoriumTechnical" id="crematoriumTechnical" name="crematoriumTechnical"></select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-3">
                                <label for="startDate" class="col-xs-5 control-label">Fecha de inicio</label>
                                <div class="col-xs-7">
                                    <div class="input-group date">
                                        <input type="text" size="12" class="form-control datepicker" id="startDate" name="startDate" aria-describedby="fecha" autocomplete="off">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="startDateError"></span>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="startTime" class="col-xs-5 control-label">Hora de inicio</label>
                                <div class="col-xs-7">
                                    <div class="input-group bootstrap-timepicker timepicker">
                                        <input type="text" size="12" class="form-control time" id="startTime" name="startTime">
                                        <div class="input-group-addon">
                                            <i class="fa fa-clock-o"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="startTimeError"></span>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="endDate" class="col-xs-4 control-label">Fecha de fin</label>
                                <div class="col-xs-8">
                                    <div class="input-group date">
                                        <input type="text" size="10" class="form-control datepicker" id="endDate" name="endDate" aria-describedby="fecha" autocomplete="off">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="endDateError"></span>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="endTime" class="col-xs-4 control-label">Hora de fin</label>
                                <div class="col-xs-8">
                                    <div class="input-group bootstrap-timepicker timepicker">
                                        <input type="text" size="10" class="form-control time" id="endTime" name="endTime">
                                        <div class="input-group-addon">
                                            <i class="fa fa-clock-o"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="endTimeError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-3">
                                <label for="user" class="col-xs-5 control-label">Usuario</label>
                                <div class="col-xs-7">
                                    <input type="text" size="17" class="form-control" id="user" name="user" disabled>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="status" class="col-xs-5 control-label">Estado</label>
                                <div class="col-xs-7">
                                    <div class="input-group status">
                                        <select class="form-control" id="status" name="status">
                                            <option value="6">Reservada</option>
                                            <option value="7">Confirmada</option>
                                        </select>
                                        <span class="input-group-addon"><i class="fa fa-circle"></i></span>
                                    </div>
                                    <span class="inputError" id="statusError"></span>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="col-xs-offset-4 col-xs-8">
                                    <div class="form-group">
                                        <label>
                                            <input id="reminder" name="reminder" type="hidden" value="0">
                                            <input id="reminder" name="reminder" class="minimal" type="checkbox" value="0">
                                            Recordatorio
                                        </label>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Empresa solicitante</span></legend>
                        <div class="row form-group">
                            <div class="col-xs-4" style="z-index: 800 !important;">
                                <label for="client" class="col-xs-6 control-label">Nombre</label>
                                <div class="col-xs-6">
                                    <select class="form-control select2 client" id="client" name="client"></select>
                                </div>
                            </div>
                            <div class="col-xs-4" style="z-index: 700 !important;">
                                <label for="cif" class="col-xs-7 control-label">CIF</label>
                                <div class="col-xs-5">
                                    <input type="text"  size="10" class="form-control" id="cif" name="cif" disabled>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <label for="phone" class="col-xs-6 control-label">Teléfono</label>
                                <div class="col-xs-6">
                                    <input type="text" size="10" class="form-control" id="phone" name="phone">
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-xs-4">
                                <label for="contactPerson" class="col-xs-6 control-label">Persona de contacto</label>
                                <div class="col-xs-6">
                                    <input type="text" size="30" class="form-control" id="contactPerson" name="contactPerson">
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <label for="phoneContact" class="col-xs-7 control-label">Teléfono contacto</label>
                                <div class="col-xs-5">
                                    <input type="text" size="10" class="form-control" id="phoneContact" name="phoneContact">
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos del fallecido</span></legend>
                        <div class=" row form-group">
                            <div class="col-xs-3">
                                <label for="deceasedName" class="col-xs-4 control-label">Nombre</label>
                                <div class="col-xs-8">
                                    <input type="text" size="23" class="form-control" id="deceasedName" name="deceasedName" disabled>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="deceasedSurname" class="col-xs-4 control-label">Apellidos</label>
                                <div class="col-xs-8">
                                    <input type="text" size="30" class="form-control" id="deceasedSurname" name="deceasedSurname" disabled>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="deceasedNIF" class="col-xs-5 control-label">DNI</label>
                                <div class="col-xs-7">
                                    <input type="text" size="15" class="form-control autocompleteNif" id="deceasedNIF" name="deceasedNIF" disabled>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <label for="number" class="col-xs-4 control-label">Nº expediente</label>
                                <div class="col-xs-8">
                                    <input type="text" size="10" class="form-control" id="number" name="number" disabled>
                                </div>
                            </div>
                        </div>
                        <div class="form-group clearfix">
                            <div class="col-xs-3">
                                <div>
                                    <label for="cremationServiceProvince" class="col-xs-4 control-label">Provincia</label>
                                    <div class="col-xs-6">
                                        <select id="cremationServiceProvince" name="cremationServiceProvince" class="form-control province"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3" style="z-index: 800 !important;">
                                <div>
                                    <label for="cremationServiceLocation" class="col-xs-4 control-label">Localidad</label>
                                    <div class="col-xs-6">
                                        <select id="cremationServiceLocation" name="cremationServiceLocation" class="form-control location" disabled></select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3" style="z-index: 700 !important;">
                                <div class="form-group">
                                    <label class="col-xs-9 control-label"><input type="checkbox" class="" id="ecologicCoffin" name="ecologicCoffin" value="ecologicCoffin" style="margin-right: 5px;">Féretro ecológico</label>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label for="crematoriumPacemaker" class="col-xs-6 control-label"><input type="checkbox" id="crematoriumPacemaker" name="crematoriumPacemaker" class="crematoriumPacemaker" style="margin-right: 5px;">Portador marcapasos</label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Contratante</span></legend>
                        <div class="form-group">
                            <div class="col-xs-4">
                                <label for="familyContactName" class="col-xs-4 control-label">Nombre</label>
                                <div class="col-xs-8">
                                    <input type="text" size="20" class="form-control" id="familyContactName" name="familyContactName">
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <label for="familyContactSurname" class="col-xs-4 control-label">Apellidos</label>
                                <div class="col-xs-8">
                                    <input type="text" size="20" class="form-control" id="familyContactSurname" name="familyContactSurname">
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <label for="familyContactPhone" class="col-xs-4 control-label">Teléfono</label>
                                <div class="col-xs-8">
                                    <input type="text" size="10" class="form-control" id="familyContactPhone" name="familyContactPhone">
                                </div>
                            </div>                            
                        </div>
                        <div class="row clearfix">
                            <div class="col-xs-4">
                                <div class="checkbox-inline crematoriumIntroductionCheck">
                                    <input type="checkbox" id="crematoriumIntroduction" name="crematoriumIntroduction"> Introducción
                                </div>
                            </div>                            
                            <div class="col-xs-4">
                                <div class="checkbox-inline crematoriumIntroductionCheck">
                                    <input type="checkbox" id="crematoriumWaitOnRoom" name="crematoriumWaitOnRoom"> Espera en sala
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="checkbox-inline crematoriumIntroductionCheck">
                                    <input type="checkbox" id="crematoriumVaseBio" name="crematoriumVaseBio"> Urna biodegradable
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-4 hide" id="arriveFamilyTime">
                            <label for="crematoriumArriveTime" class="col-xs-4 control-label">Hora llegada familia</label>
                            <div class="col-xs-8">
                                <div class="input-group bootstrap-timepicker timepicker">
                                    <input type="text" size="12" class="form-control time" id="crematoriumArriveTime" name="crematoriumArriveTime">
                                    <div class="input-group-addon">
                                        <i class="fa fa-clock-o"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Productos</span></legend>
                        <div id="products" class="table-responsive"></div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Entrega de cenizas</span></legend>
                        <div class="row clearfix">
                            <div class="col-xs-4">
                                <label for="authName" class="col-xs-4 control-label">Nombre</label>
                                <div class="col-xs-8">
                                    <input type="text" size="30" class="form-control" id="authName" name="authName">
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <label for="authDni" class="col-xs-4 control-label">DNI</label>
                                <div class="col-xs-8">
                                    <input type="text" size="20" class="form-control" id="authDni" name="authDni">
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="form-group">
                                    <label for="authContactPhone" class="col-xs-4 control-label">Teléfono</label>
                                    <div class="col-xs-8">
                                        <input type="text" size="25" class="form-control" id="authContactPhone" name="authContactPhone">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-xs-4">
                                <div>
                                    <label for="authDate" class="col-xs-4 control-label">Fecha</label>
                                    <div class="col-xs-8">
                                        <div class="input-group date">
                                            <input type="text" size="25" class="form-control datepicker" id="authDate" name="authDate" autocomplete="off">
                                            <div class="input-group-addon">
                                                <i class="fa fa-calendar"></i>
                                            </div>
                                        </div>
                                        <span class="inputError" id="authDateError"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="bootstrap-timepicker timepicker">
                                    <label for="authTime" class="col-xs-4 control-label">Hora</label>
                                    <div class="col-xs-8">
                                        <div class="input-group">
                                            <input type="text" size="15" class="form-control time" id="authTime" name="authTime">
                                            <div class="input-group-addon">
                                                <i class="fa fa-clock-o"></i>
                                            </div>
                                        </div>
                                        <span class="inputError" id="authTimeError"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="form-group">
                                    <label for="authPlace" class="col-xs-4 control-label">Lugar</label>
                                    <div class="col-xs-8">
                                        <input type="text" size="25" class="form-control autocompleteNif" id="authPlace" name="authPlace">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="deleteCremation" type="button" class="btn btn-danger"><i class="fa fa-trash" aria-hidden="true"></i> Eliminar</button>
                        <button id="saveEditEvent" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>