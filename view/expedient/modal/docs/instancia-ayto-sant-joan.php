<div id="instancia-ayto-sant-joan-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="instancia-ayto-sant-joan-modal" data-backdrop="static">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formInstanciaAytoSantJoan" name="formInstanciaAytoSantJoan">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-for="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Instancia de <span class="bolder">Ayto. Sant Joan de Labritja</span></h4>
                </div>
                <div class="modal-body">
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos del interesado</span></legend>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="interestedType">Tipo de persona</label>
                                    <div class="col-xs-7">
                                        <select id="interestedType" name="interestedType" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="Física">Física</option>
                                            <option value="Jurídica">Jurídica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="interestedNif">NIF/CIF</label>
                                    <div class="col-xs-8">
                                        <input id="interestedNif" name='interestedNif' type="text" size="12" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="interestedName">Nombre</label>
                                    <div class="col-xs-8">
                                        <input id="interestedName" name='interestedName' type="text" size="30" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(Sólo si Tipo de persona = Física).</i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group" style='display:flex'>
                                    <label class="col-xs-4 control-label toNormal" for="interestedSurname1Pre">Primer apellido</label>
                                    <div class="col-xs-2">
                                        <input id="interestedSurname1Pre" name='interestedSurname1Pre' type="text" size="5" class="form-control" style='width:100%' autocomplete="off">
                                    </div>
                                    <div class="col-xs-6">
                                        <input id="interestedSurname1" name='interestedSurname1' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group" style='display:flex'>
                                    <label class="col-xs-4 control-label toNormal" for="interestedSurname2Pre">Segundo apellido</label>
                                    <div class="col-xs-2">
                                        <input id="interestedSurname2Pre" name='interestedSurname2Pre' type="text" size="5" class="form-control" style='width:100%' autocomplete="off">
                                    </div>
                                    <div class="col-xs-6">
                                        <input id="interestedSurname2" name='interestedSurname2' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label class="col-xs-1 control-label toNormal" for="interestedBusinessName">Razón social</label>
                                    <div class="col-xs-8">
                                        <input id="interestedBusinessName" name='interestedBusinessName' type="text" size="162" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(Sólo si Tipo de persona = Jurídica).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos del representante</span></legend>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="representantType">Tipo de persona</label>
                                    <div class="col-xs-7">
                                        <select id="representantType" name="representantType" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="Física">Física</option>
                                            <option value="Jurídica">Jurídica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="representantNif">NIF/CIF</label>
                                    <div class="col-xs-8">
                                        <input id="representantNif" name='representantNif' type="text" size="12" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="representantName">Nombre</label>
                                    <div class="col-xs-8">
                                        <input id="representantName" name='representantName' type="text" size="30" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(Sólo si Tipo de persona = Física).</i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group" style='display:flex'>
                                    <label class="col-xs-4 control-label toNormal" for="representantSurname1Pre">Primer apellido</label>
                                    <div class="col-xs-2">
                                        <input id="representantSurname1Pre" name='representantSurname1Pre' type="text" size="5" class="form-control" style='width:100%' autocomplete="off">
                                    </div>
                                    <div class="col-xs-6">
                                        <input id="representantSurname1" name='representantSurname1' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group" style='display:flex'>
                                    <label class="col-xs-4 control-label toNormal" for="representantSurname2Pre">Segundo apellido</label>
                                    <div class="col-xs-2">
                                        <input id="representantSurname2Pre" name='representantSurname2Pre' type="text" size="5" class="form-control" style='width:100%' autocomplete="off">
                                    </div>
                                    <div class="col-xs-6">
                                        <input id="representantSurname2" name='representantSurname2' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label class="col-xs-1 control-label toNormal" for="representantBusinessName">Razón social</label>
                                    <div class="col-xs-8">
                                        <input id="representantBusinessName" name='representantBusinessName' type="text" size="162" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(Sólo si Tipo de persona = Jurídica).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label class="col-xs-2 control-label toNormal" for="representantAuthority">Poder de representación que ostenta</label>
                                    <div class="col-xs-10 large-select2">
                                        <select id="representantAuthority" name="representantAuthority" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="Poseo un mandato firmado por el interesado que me habilita a realizar este trámite en su nombre">Poseo un mandato firmado por el interesado que me habilita a realizar este trámite en su nombre</option>
                                            <option value="Soy representante Legal(de menor, incapacitado o ausente)">Soy representante Legal(de menor, incapacitado o ausente)</option>
                                            <option value="Figuro como representante en un Poder Notarial">Figuro como representante en un Poder Notarial</option>
                                            <option value="Figuro como representante en el Registro Eléctronico de Apoderamientos (REA)">Figuro como representante en el Registro Eléctronico de Apoderamientos (REA)</option>
                                            <option value="Estoy adherido a un convenio con esta administración para representar al interesado">Estoy adherido a un convenio con esta administración para representar al interesado</option>
                                            <option value="Soy funcionario Habilitado">Soy funcionario Habilitado</option>
                                            <option value="Certificado de persona física en representación de persona jurídica">Certificado de persona física en representación de persona jurídica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label class="col-xs-2 control-label toNormal" for="representantCovenant">Nombre del convenio</label>
                                    <div class="col-xs-10 large-select2">
                                        <select id="representantCovenant" name="representantCovenant" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="No hay en estos momentos convenios vigentes">No hay en estos momentos convenios vigentes</option>
                                        </select>
                                        <br>
                                        <span style='font-size:10px'><i>(Solo si Poder de representación que ostenta = Estoy adherido a un convenio con esta administración para representar al interesado).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>  

                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos a efectos de notificaciones</span></legend>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-3 control-label toNormal" for="notificationSource">Medio</label>
                                    <div class="col-xs-7">
                                        <select id="notificationSource" name="notificationSource" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="En papel">En papel</option>
                                            <option value="Electrónica">Electrónica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="form-group">
                                    <label class="col-xs-2 control-label toNormal" for="notificationEmail">Email</label>
                                    <div class="col-xs-8">
                                        <input id="notificationEmail" name='notificationEmail' type="text" size="50" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-2 control-label toNormal" for="notificationPhone">Móvil</label>
                                    <div class="col-xs-8">
                                        <input id="notificationPhone" name='notificationPhone' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style='margin-left: -8px;'>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationCountry">País</label>
                                    <div class="col-xs-8">
                                        <input id="notificationCountry" name='notificationCountry' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2" style='margin-left: 10px;'>
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationProvince">Provincia</label>
                                    <div class="col-xs-8">
                                        <input id="notificationProvince" name='notificationProvince' type="text" size="20" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-3 control-label toNormal" for="notificationLocality">Municipio</label>
                                    <div class="col-xs-9">
                                        <input id="notificationLocality" name='notificationLocality' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationCore">Núcleo diseminado</label>
                                    <div class="col-xs-8">
                                        <input id="notificationCore" name='notificationCore' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationPostalCode">Código postal</label>
                                    <div class="col-xs-8">
                                        <input id="notificationPostalCode"  name='notificationPostalCode' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationAddressType">Tipo de vía</label>
                                    <div class="col-xs-8">
                                        <input id="notificationAddressType" name='notificationAddressType' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="form-group">
                                    <label class="col-xs-3 control-label toNormal" for="notificationAddress">Dirección</label>
                                    <div class="col-xs-8">
                                        <input id="notificationAddress" name='notificationAddress' type="text" size="65" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3" style='margin-left: 15px;'>
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationAddresNum">Número/Km</label>
                                    <div class="col-xs-4">
                                        <input id="notificationAddresNum" name='notificationAddresNum' type="text" size="10" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1" style='margin-left: -120px;'>
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="notificationAddresBlock">Bloque</label>
                                    <div class="col-xs-8">
                                        <input id="notificationAddresBlock" name='notificationAddresBlock' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="notificationAddressStairs">Escalera</label>
                                    <div class="col-xs-7">
                                        <input id="notificationAddressStairs" name='notificationAddressStairs' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="notificationAddressFloor">Planta</label>
                                    <div class="col-xs-7">
                                        <input id="notificationAddressFloor" name='notificationAddressFloor' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1" style='margin-left: 15px;'>
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="notificationAddressDoor">Puerta</label>
                                    <div class="col-xs-7">
                                        <input id="notificationAddressDoor" name='notificationAddressDoor' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="notificationAddressExtra">Extra</label>
                                    <div class="col-xs-7">
                                        <input id="notificationAddressExtra" name='notificationAddressExtra' type="text" size="10" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos del fallecido</span></legend>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedType">Tipo de persona</label>
                                    <div class="col-xs-7">
                                        <select id="deceasedType" name="deceasedType" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="Física">Física</option>
                                            <option value="Jurídica">Jurídica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedNif">NIF/CIF</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedNif" name='deceasedNif' type="text" size="12" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedNameData">Nombre</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedNameData" name='deceasedNameData' type="text" size="30" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(Sólo si Tipo de persona = Física).</i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group" style='display:flex'>
                                    <label class="col-xs-4 control-label toNormal" for="deceasedSurname1Pre">Primer apellido</label>
                                    <div class="col-xs-2">
                                        <input id="deceasedSurname1Pre" name='deceasedSurname1Pre' type="text" size="5" class="form-control" style='width:100%' autocomplete="off">
                                    </div>
                                    <div class="col-xs-6">
                                        <input id="deceasedSurname1" name='deceasedSurname1' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group" style='display:flex'>
                                    <label class="col-xs-4 control-label toNormal" for="deceasedSurname2Pre">Segundo apellido</label>
                                    <div class="col-xs-2">
                                        <input id="deceasedSurname2Pre" name='deceasedSurname2Pre' type="text" size="5" class="form-control" style='width:100%' autocomplete="off">
                                    </div>
                                    <div class="col-xs-6">
                                        <input id="deceasedSurname2" name='deceasedSurname2' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label class="col-xs-1 control-label toNormal" for="deceasedBusinessName">Razón social</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedBusinessName" name='deceasedBusinessName' type="text" size="162" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(Sólo si Tipo de persona = Jurídica).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-3 control-label toNormal" for="deceasedSource">Medio</label>
                                    <div class="col-xs-7">
                                        <select id="deceasedSource" name="deceasedSource" class="form-control select2">
                                            <option value="" disabled selected hidden></option>
                                            <option value="En papel">En papel</option>
                                            <option value="Electrónica">Electrónica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="form-group">
                                    <label class="col-xs-2 control-label toNormal" for="deceasedEmail">Email</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedEmail" name='deceasedEmail' type="text" size="50" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-2 control-label toNormal" for="deceasedPhone">Móvil</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedPhone" name='deceasedPhone' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style='margin-left: -8px;'>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedCountry">País</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedCountry" name='deceasedCountry' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2" style='margin-left: 10px;'>
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedProvince">Provincia</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedProvince" name='deceasedProvince' type="text" size="20" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-3 control-label toNormal" for="deceasedLocality">Municipio</label>
                                    <div class="col-xs-9">
                                        <input id="deceasedLocality" name='deceasedLocality' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedCore">Núcleo diseminado</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedCore" name='deceasedCore' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedPostalCode">Código postal</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedPostalCode" name='deceasedPostalCode' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedAddressType">Tipo de vía</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedAddressType" name='deceasedAddressType' type="text" size="25" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="form-group">
                                    <label class="col-xs-3 control-label toNormal" for="deceasedAddress">Dirección</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedAddress" name='deceasedAddress' type="text" size="65" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3" style='margin-left: 15px;'>
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedAddresNum">Número/Km</label>
                                    <div class="col-xs-4">
                                        <input id="deceasedAddresNum" name='deceasedAddresNum' type="text" size="10" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1" style='margin-left: -120px;'>
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedAddresBlock">Bloque</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedAddresBlock" name='deceasedAddresBlock' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedAddressStairs">Escalera</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedAddressStairs" name='deceasedAddressStairs' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedAddressFloor">Planta</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedAddressFloor" name='deceasedAddressFloor' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1" style='margin-left: 15px;'>
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedAddressDoor">Puerta</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedAddressDoor" name='deceasedAddressDoor' type="text" size="5" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-1">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedAddressExtra">Extra</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedAddressExtra" name='deceasedAddressExtra' type="text" size="10" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedGeographicalPoint">Punto geográfico</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedGeographicalPoint" name='deceasedGeographicalPoint' type="text" size="30" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="deceasedDeliveryPoint">Punto de entrega</label>
                                    <div class="col-xs-8">
                                        <input id="deceasedDeliveryPoint" name='deceasedDeliveryPoint' type="text" size="30" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedRelationship">Parentesco del solicitante</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedRelationship" name='deceasedRelationship' type="text" size="30" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedPlaceLocation">Lugar de fallecimiento</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedPlaceLocation" name='deceasedPlaceLocation' type="text" size="30" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="deceasedDate">Fecha defunción</label>
                                    <div class="col-xs-7">
                                        <input id="deceasedDate" name='deceasedDate' type="text" size="30" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(dd/mm/aaaa hh:mm).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos del nicho</span></legend>
                        <div class="row">
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-4 control-label toNormal" for="nicheNum">Nº de nicho</label>
                                    <div class="col-xs-8">
                                        <input id="nicheNum" name='nicheNum' type="text" size="15" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-6 control-label toNormal" for="nicheLocation">Ubicación del nicho</label>
                                    <div class="col-xs-6">
                                        <input id="nicheLocation" name='nicheLocation' type="text" size="15" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos de la inhumación</span></legend>
                        <div class="row">
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-6 control-label toNormal" for="inhumationDate">Fecha inhumación</label>
                                    <div class="col-xs-6">
                                        <input id="inhumationDate" name='inhumationDate' type="text" size="15" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(dd/mm/aaaa hh:mm).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                    <div class="form-group">
                                    <label class="col-xs-1 control-label toNormal" for="inhumationComments">Observaciones</label>
                                    <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                                        <textarea type="text" class="form-control" id="inhumationComments" name="inhumationComments" rows="4" cols="100"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Documentación obligatoria</span></legend>
                        <div class="row" style='margin-left: 15px;'>
                            <div class="col-xs-3">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="obligatoryCertificate" name="obligatoryCertificate" class="minimal"> Certificado de Defunción
                                </label>
                            </div>
                        </div>
                        <div class="row" style='margin-left: 15px; padding-bottom: 15px;'>
                            <div class="col-xs-3">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="obligatoryIdentificationData" name="obligatoryIdentificationData" class="minimal">Datos de Identificación
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Consentimiento y Deber de Informar a los Interesados sobre Protección de Datos</span></legend>
                        <div class="row" style='margin-left: 15px;padding-bottom: 15px;'>
                            <div class="col-xs-12">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="LOPDConsent" name="LOPDConsent" class="minimal"> He sido informado de que esta Entidad va a tratar y guardar los datos aportados en la instancia y en la documentación que la acompaña para la realización de actuaciones administrativas
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Firma</span></legend>
                        <div class="row" style='margin-left: 15px;margin-bottom:15px;'>
                            <div class="col-xs-12">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="firmConsent" name="firmConsent" class="minimal"> PRESTA SU CONSENTIMIENTO para que la entidad realice consultas de los datos del solicitante/representante a través de la Plataforma de Intermediación de Datos y otros servicios interoperables
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="firmLocation">Municipio firma</label>
                                    <div class="col-xs-6">
                                        <input id="firmLocation" name='firmLocation' type="text" size="15" class="form-control" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label class="col-xs-5 control-label toNormal" for="firmDate">Fecha firma</label>
                                    <div class="col-xs-6">
                                        <input id="firmDate" name='firmDate' type="text" size="15" class="form-control" autocomplete="off">
                                        <span style='font-size:10px'><i>(dd/mm/aaaa hh:mm).</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button id="saveNewInstanciaAytoSantJoan" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>