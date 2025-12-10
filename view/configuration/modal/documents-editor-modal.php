<div class="modal fade" id="modal-new-category" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nueva <span class="bolder">Categoría</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewDataCategory" name="formNewDataCategory">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewCategory" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-category" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Categoría</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditDataCategory" name="formEditDataCategory">
                    <input type="hidden" id="categoryID" name="categoryID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditCategory" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-document" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Documento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pageSize" class="col-xs-3 control-label">Tamaño</label>
                        <div class="col-xs-9">
                            <select class="form-control" id="pageSize" name="pageSize" style="width: 100px !important;">
                                <option value="A3">A3</option>
                                <option value="srA3">srA3</option>
                                <option value="A4" selected>A4</option>
                                <option value="A5">A5</option>
                                <option value="A6">A6</option>
                            </select>
                            <span class="inputError" id="pageSizeError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewDocument" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-document" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Documento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <input type="hidden" id="documentID" name="documentID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditDocument" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-duplicate-document" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Documento</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formDuplicateData" name="formDuplicateData">
                    <input type="hidden" id="documentID" name="documentID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="categoryCopy" class="col-xs-3 control-label">Categoría</label>
                        <div class="col-xs-9">
                            <select class="form-control" id="categoryCopy" name="categoryCopy"></select>
                            <span class="inputError" id="categoryCopyError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="goDuplicateDocument" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-preview" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Vista preliminar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <div id="showPreview"></div>
                <div class="overlay"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade modalDownload" id="modal-download" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Guardar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <p>El documento se está guardando. En breves se descargará el pdf</p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-help" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Guardar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <p><strong>Ctrl + z</strong> : Deshacer</p>
                <p><strong>Ctrl + y</strong> : Rehacer</p>
                <hr>
                <h4><strong>Con un elemento seleccionado</strong></h4>
                <p><strong>Supr</strong> : Eliminar elemento</p>
                <p><strong>Ctrl + q</strong> : Adelante</p>
                <p><strong>Ctrl + m</strong> : Atrás</p>
                <p><strong>Flecha arriba</strong> : Mover hacia arriba (5pt)</p>
                <p><strong>Flecha abajo</strong> : Mover hacia abajo (5pt)</p>
                <p><strong>Flecha izquierda</strong> : Mover hacia la izquierda (5pt)</p>
                <p><strong>Flecha derecha</strong> : Mover hacia la derecha (5pt)</p>
                <p><strong>Shift + flecha arriba</strong> : Mover hacia arriba (10pt)</p>
                <p><strong>Shift + flecha abajo</strong> : Mover hacia abajo (10pt)</p>
                <p><strong>Shift + flecha izquierda</strong> : Mover hacia la izquierda (10pt)</p>
                <p><strong>Shift + flecha derecha</strong> : Mover hacia la derecha (10pt)</p>
                <p><strong>Ctrl + b</strong> : Negrita</p>
                <p><strong>Ctrl + k</strong> : Cursiva</p>
                <p><strong>Ctrl + u</strong> : Subrayado</p>
                <p><strong>Ctrl + l</strong> : Tachado</p>
                <p><strong>Ctrl + a</strong> : Alinear a la izquierda</p>
                <p><strong>Ctrl + s</strong> : Centrar</p>
                <p><strong>Ctrl + d</strong> : Alinear a la derecha</p>
                <p><strong>Ctrl + f</strong> : Justificar</p>
                <p><strong>Alt + (0 + 1 + 3 + 4) </strong> : Insertar cruz</p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-expedient-info" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Datos expediente</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <div class="alert alert-info">Puedes hacer click sobre cada ítem para copiarlo al portapapeles</div>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Fecha</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#224#"><strong>Hoy (formato corto)</strong>: #224#</span></li>
                                <li><span class="expediente-copy-alias" alias="#225#"><strong>Hoy (formato largo)</strong>: #225#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos del Expediente</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#1#"><strong>Número de expediente</strong>: #1#</span></li>
                                <li><span class="expediente-copy-alias" alias="#4#"><strong>Fecha de solicitud</strong>: #4#</span></li>
                                <li><span class="expediente-copy-alias" alias="#167#"><strong>Fecha de solicitud (día)</strong>: #167#</span></li>
                                <li><span class="expediente-copy-alias" alias="#168#"><strong>Fecha de solicitud (mes)</strong>: #168#</span></li>
                                <li><span class="expediente-copy-alias" alias="#169#"><strong>Fecha de solicitud (año)</strong>: #169#</span></li>
                                <li><span class="expediente-copy-alias" alias="#2#"><strong>Hora solicitud</strong>: #2#</span></li>
                                <li><span class="expediente-copy-alias" alias="#254#"><strong>Fecha de llegada</strong>: #254#</span></li>
                                <li><span class="expediente-copy-alias" alias="#255#"><strong>Fecha de llegada (día)</strong>: #255#</span></li>
                                <li><span class="expediente-copy-alias" alias="#256#"><strong>Fecha de llegada (mes)</strong>: #256#</span></li>
                                <li><span class="expediente-copy-alias" alias="#257#"><strong>Fecha de llegada (año)</strong>: #257#</span></li>
                                <li><span class="expediente-copy-alias" alias="#3#"><strong>Hora de llegada</strong>: #3#</span></li>
                                <li><span class="expediente-copy-alias" alias="#5#"><strong>Tipo de expediente</strong>: #5#</span></li>
                                <li><span class="expediente-copy-alias" alias="#6#"><strong>Tipo de cliente</strong>: #6#</span></li>
                                <li><span class="expediente-copy-alias" alias="#7#"><strong>Nº póliza</strong>: #7#</span></li>
                                <li><span class="expediente-copy-alias" alias="#8#"><strong>Capital</strong>: #8#</span></li>
                                <li><span class="expediente-copy-alias" alias="#9#"><strong>Nº siniestro</strong>: #9#</span></li>
                                <li><span class="expediente-copy-alias" alias="#10#"><strong>Estado expediente</strong>: #10#</span></li>
                                <li><span class="expediente-copy-alias" alias="#247#"><strong>Referencia interna</strong>: #247#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos del Solicitante</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#11#"><strong>Nombre</strong>: #11#</span></li>
                                <li><span class="expediente-copy-alias" alias="#12#"><strong>Apellidos</strong>: #12#</span></li>
                                <li><span class="expediente-copy-alias" alias="#157#"><strong>Apellido 1</strong>: #157#</span></li>
                                <li><span class="expediente-copy-alias" alias="#158#"><strong>Apellido 2</strong>: #158#</span></li>
                                <li><span class="expediente-copy-alias" alias="#13#"><strong>Domicilio</strong>: #13#</span></li>
                                <li><span class="expediente-copy-alias" alias="#14#"><strong>E-mail</strong>: #14#</span></li>
                                <li><span class="expediente-copy-alias" alias="#15#"><strong>Provincia</strong>: #15#</span></li>
                                <li><span class="expediente-copy-alias" alias="#16#"><strong>Localidad</strong>: #16#</span></li>
                                <li><span class="expediente-copy-alias" alias="#258#"><strong>Código postal</strong>: #258#</span></li>
                                <li><span class="expediente-copy-alias" alias="#17#"><strong>Teléfono</strong>: #17#</span></li>
                                <li><span class="expediente-copy-alias" alias="#18#"><strong>Móvil</strong>: #18#</span></li>
                                <li><span class="expediente-copy-alias" alias="#19#"><strong>NIF/NIE/Pasaporte/Otro</strong>: #19#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Contratante</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#20#"><strong>Nombre</strong>: #20#</span></li>
                                <li><span class="expediente-copy-alias" alias="#21#"><strong>Apellidos</strong>: #21#</span></li>
                                <li><span class="expediente-copy-alias" alias="#159#"><strong>Apellido 1</strong>: #159#</span></li>
                                <li><span class="expediente-copy-alias" alias="#160#"><strong>Apellido 2</strong>: #160#</span></li>
                                <li><span class="expediente-copy-alias" alias="#22#"><strong>Domicilio</strong>: #22#</span></li>
                                <li><span class="expediente-copy-alias" alias="#23#"><strong>E-mail</strong>: #23#</span></li>
                                <li><span class="expediente-copy-alias" alias="#24#"><strong>Provincia</strong>: #24#</span></li>
                                <li><span class="expediente-copy-alias" alias="#25#"><strong>Localidad</strong>: #25#</span></li>
                                <li><span class="expediente-copy-alias" alias="#259#"><strong>Código postal</strong>: #259#</span></li>
                                <li><span class="expediente-copy-alias" alias="#26#"><strong>Teléfono</strong>: #26#</span></li>
                                <li><span class="expediente-copy-alias" alias="#27#"><strong>Móvil</strong>: #27#</span></li>
                                <li><span class="expediente-copy-alias" alias="#28#"><strong>NIF/NIE/Pasaporte/Otro</strong>: #28#</span></li>
                                <li><span class="expediente-copy-alias" alias="#29#"><strong>Parentesco</strong>: #29#</span></li>
                                <li><span class="expediente-copy-alias" alias="#30#"><strong>Origen</strong>: #30#</span></li>
                                <li><span class="expediente-copy-alias" alias="#31#"><strong>Otro contacto - Nombre</strong>: #31#</span></li>
                                <li><span class="expediente-copy-alias" alias="#32#"><strong>Otro contracto - Teléfono</strong>: #32#</span></li>
                                <li><span class="expediente-copy-alias" alias="#33#"><strong>Otro contracto - Parentesco</strong>: #33#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Facturar a</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#34#"><strong>Nombre comercial</strong>: #34#</span></li>
                                <li><span class="expediente-copy-alias" alias="#35#"><strong>Nombre</strong>: #35#</span></li>
                                <li><span class="expediente-copy-alias" alias="#36#"><strong>Apellidos</strong>: #36#</span></li>
                                <li><span class="expediente-copy-alias" alias="#161#"><strong>Apellido 1</strong>: #161#</span></li>
                                <li><span class="expediente-copy-alias" alias="#162#"><strong>Apellido 2</strong>: #162#</span></li>
                                <li><span class="expediente-copy-alias" alias="#37#"><strong>CIF/NIF</strong>: #37#</span></li>
                                <li><span class="expediente-copy-alias" alias="#38#"><strong>E-mail</strong>: #38#</span></li>
                                <li><span class="expediente-copy-alias" alias="#39#"><strong>Provincia</strong>: #39#</span></li>
                                <li><span class="expediente-copy-alias" alias="#40#"><strong>Localidad</strong>: #40#</span></li>
                                <li><span class="expediente-copy-alias" alias="#260#"><strong>Código postal</strong>: #260#</span></li>
                                <li><span class="expediente-copy-alias" alias="#41#"><strong>Domicilio</strong>: #41#</span></li>
                                <li><span class="expediente-copy-alias" alias="#42#"><strong>Teléfono</strong>: #42#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos del Difunto</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#43#"><strong>Nombre</strong>: #43#</span></li>
                                <li><span class="expediente-copy-alias" alias="#44#"><strong>Apellidos</strong>: #44#</span></li>
                                <li><span class="expediente-copy-alias" alias="#163#"><strong>Apellido 1</strong>: #163#</span></li>
                                <li><span class="expediente-copy-alias" alias="#164#"><strong>Apellido 2</strong>: #164#</span></li>
                                <li><span class="expediente-copy-alias" alias="#45#"><strong>NIF/NIE/Pasaporte/Otro</strong>: #45#</span></li>
                                <li><span class="expediente-copy-alias" alias="#46#"><strong>Estado civil</strong>: #46#</span></li>
                                <li><span class="expediente-copy-alias" alias="#47#"><strong>1ª nupcias con</strong>: #47#</span></li>
                                <li><span class="expediente-copy-alias" alias="#48#"><strong>2ª nupcias con</strong>: #48#</span></li>
                                <li><span class="expediente-copy-alias" alias="#49#"><strong>Género (D./Dña.)</strong>: #49#</span></li>
                                <li><span class="expediente-copy-alias" alias="#50#"><strong>Género</strong>: #50#</span></li>
                                <li><span class="expediente-copy-alias" alias="#51#"><strong>Hijo de (1)</strong>: #51#</span></li>
                                <li><span class="expediente-copy-alias" alias="#52#"><strong>Hijo de (2)</strong>: #52#</span></li>
                                <li><span class="expediente-copy-alias" alias="#53#"><strong>Nacionalidad</strong>: #53#</span></li>
                                <li><span class="expediente-copy-alias" alias="#54#"><strong>Fecha de nacimiento</strong>: #54#</span></li>
                                <li><span class="expediente-copy-alias" alias="#170#"><strong>Fecha de nacimiento (día)</strong>: #170#</span></li>
                                <li><span class="expediente-copy-alias" alias="#171#"><strong>Fecha de nacimiento (mes)</strong>: #171#</span></li>
                                <li><span class="expediente-copy-alias" alias="#172#"><strong>Fecha de nacimiento (año)</strong>: #172#</span></li>
                                <li><span class="expediente-copy-alias" alias="#253#"><strong>Edad</strong>: #253#</span></li>
                                <li><span class="expediente-copy-alias" alias="#55#"><strong>Provincia de nacimiento</strong>: #55#</span></li>
                                <li><span class="expediente-copy-alias" alias="#56#"><strong>Lugar de nacimiento</strong>: #56#</span></li>
                                <li><span class="expediente-copy-alias" alias="#57#"><strong>Domicilio habitual</strong>: #57#</span></li>
                                <li><span class="expediente-copy-alias" alias="#58#"><strong>Localidad</strong>: #58#</span></li>
                                <li><span class="expediente-copy-alias" alias="#59#"><strong>Provincia</strong>: #59#</span></li>
                                <li><span class="expediente-copy-alias" alias="#60#"><strong>Fallecido en</strong>: #60#</span></li>
                                <li><span class="expediente-copy-alias" alias="#226#"><strong>Fallecido en (localidad)</strong>: #226#</span></li>
                                <li><span class="expediente-copy-alias" alias="#227#"><strong>Fallecido en (provincia)</strong>: #227#</span></li>
                                <li><span class="expediente-copy-alias" alias="#61#"><strong>Fecha de fallecimiento</strong>: #61#</span></li>
                                <li><span class="expediente-copy-alias" alias="#173#"><strong>Fecha de fallecimiento (día)</strong>: #173#</span></li>
                                <li><span class="expediente-copy-alias" alias="#174#"><strong>Fecha de fallecimiento (mes)</strong>: #174#</span></li>
                                <li><span class="expediente-copy-alias" alias="#175#"><strong>Fecha de fallecimiento (año)</strong>: #175#</span></li>
                                <li><span class="expediente-copy-alias" alias="#62#"><strong>Hora de fallecimiento</strong>: #62#</span></li>
                                <li><span class="expediente-copy-alias" alias="#63#"><strong>Médico</strong>: #63#</span></li>
                                <li><span class="expediente-copy-alias" alias="#64#"><strong>Certificado médico nº</strong>: #64#</span></li>
                                <li><span class="expediente-copy-alias" alias="#65#"><strong>Causa principal de la muerte</strong>: #65#</span></li>
                                <li><span class="expediente-copy-alias" alias="#66#"><strong>Juzgado de</strong>: #66#</span></li>
                                <li><span class="expediente-copy-alias" alias="#67#"><strong>Juzgado nº</strong>: #67#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos de la Velación</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#68#"><strong>Casa mortuoria</strong>: #68#</span></li>
                                <li><span class="expediente-copy-alias" alias="#69#"><strong>Nº de sala</strong>: #69#</span></li>
                                <li><span class="expediente-copy-alias" alias="#70#"><strong>Fecha inicio velación (1)</strong>: #70#</span></li>
                                <li><span class="expediente-copy-alias" alias="#176#"><strong>Fecha inicio velación (1) (día)</strong>: #176#</span></li>
                                <li><span class="expediente-copy-alias" alias="#177#"><strong>Fecha inicio velación (1) (mes)</strong>: #177#</span></li>
                                <li><span class="expediente-copy-alias" alias="#178#"><strong>Fecha inicio velación (1) (año)</strong>: #178#</span></li>
                                <li><span class="expediente-copy-alias" alias="#71#"><strong>Hora inicio velación (1)</strong>: #71#</span></li>
                                <li><span class="expediente-copy-alias" alias="#232#"><strong>Fecha fin velación (1)</strong>: #232#</span></li>
                                <li><span class="expediente-copy-alias" alias="#233#"><strong>Fecha fin velación (1) (día)</strong>: #233#</span></li>
                                <li><span class="expediente-copy-alias" alias="#234#"><strong>Fecha fin velación (1) (mes)</strong>: #234#</span></li>
                                <li><span class="expediente-copy-alias" alias="#235#"><strong>Fecha fin velación (1) (año)</strong>: #235#</span></li>
                                <li><span class="expediente-copy-alias" alias="#236#"><strong>Hora fin velación (1)</strong>: #236#</span></li>
                                <li><span class="expediente-copy-alias" alias="#237#"><strong>Fecha inicio velación (2)</strong>: #237#</span></li>
                                <li><span class="expediente-copy-alias" alias="#238#"><strong>Fecha inicio velación (2) (día)</strong>: #238#</span></li>
                                <li><span class="expediente-copy-alias" alias="#239#"><strong>Fecha inicio velación (2) (mes)</strong>: #239#</span></li>
                                <li><span class="expediente-copy-alias" alias="#240#"><strong>Fecha inicio velación (2) (año)</strong>: #240#</span></li>
                                <li><span class="expediente-copy-alias" alias="#241#"><strong>Hora inicio velación (2)</strong>: #241#</span></li>
                                <li><span class="expediente-copy-alias" alias="#242#"><strong>Fecha fin velación (2)</strong>: #242#</span></li>
                                <li><span class="expediente-copy-alias" alias="#243#"><strong>Fecha fin velación (2) (día)</strong>: #243#</span></li>
                                <li><span class="expediente-copy-alias" alias="#244#"><strong>Fecha fin velación (2) (mes)</strong>: #244#</span></li>
                                <li><span class="expediente-copy-alias" alias="#245#"><strong>Fecha fin velación (2) (año)</strong>: #245#</span></li>
                                <li><span class="expediente-copy-alias" alias="#246#"><strong>Hora fin velación (2)</strong>: #246#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos del Entierro</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#72#"><strong>Tipo Ceremonia</strong>: #72#</span></li>
                                <li><span class="expediente-copy-alias" alias="#73#"><strong>Lugar Ceremonia</strong>: #73#</span></li>
                                <li><span class="expediente-copy-alias" alias="#74#"><strong>Tipo Inhumación</strong>: #74#</span></li>
                                <li><span class="expediente-copy-alias" alias="#75#"><strong>Lugar Inhumación</strong>: #75#</span></li>
                                <li><span class="expediente-copy-alias" alias="#76#"><strong>Fecha salida</strong>: #76#</span></li>
                                <li><span class="expediente-copy-alias" alias="#179#"><strong>Fecha salida (día)</strong>: #179#</span></li>
                                <li><span class="expediente-copy-alias" alias="#180#"><strong>Fecha salida (mes)</strong>: #180#</span></li>
                                <li><span class="expediente-copy-alias" alias="#181#"><strong>Fecha salida (año)</strong>: #181#</span></li>
                                <li><span class="expediente-copy-alias" alias="#77#"><strong>Hora salida</strong>: #77#</span></li>
                                <li><span class="expediente-copy-alias" alias="#78#"><strong>Fecha ceremonia</strong>: #78#</span></li>
                                <li><span class="expediente-copy-alias" alias="#182#"><strong>Fecha ceremonia (día)</strong>: #182#</span></li>
                                <li><span class="expediente-copy-alias" alias="#183#"><strong>Fecha ceremonia (mes)</strong>: #183#</span></li>
                                <li><span class="expediente-copy-alias" alias="#184#"><strong>Fecha ceremonia (año)</strong>: #184#</span></li>
                                <li><span class="expediente-copy-alias" alias="#79#"><strong>Hora ceremonia</strong>: #79#</span></li>
                                <li><span class="expediente-copy-alias" alias="#80#"><strong>Fecha funeral</strong>: #80#</span></li>
                                <li><span class="expediente-copy-alias" alias="#185#"><strong>Fecha funeral (día)</strong>: #185#</span></li>
                                <li><span class="expediente-copy-alias" alias="#186#"><strong>Fecha funeral (mes)</strong>: #186#</span></li>
                                <li><span class="expediente-copy-alias" alias="#187#"><strong>Fecha funeral (año)</strong>: #187#</span></li>
                                <li><span class="expediente-copy-alias" alias="#81#"><strong>Hora funeral</strong>: #81#</span></li>
                                <li><span class="expediente-copy-alias" alias="#218#"><strong>Fecha inhumación</strong>: #218#</span></li>
                                <li><span class="expediente-copy-alias" alias="#219#"><strong>Fecha inhumación (día)</strong>: #219#</span></li>
                                <li><span class="expediente-copy-alias" alias="#220#"><strong>Fecha inhumación (mes)</strong>: #220#</span></li>
                                <li><span class="expediente-copy-alias" alias="#221#"><strong>Fecha inhumación (año)</strong>: #221#</span></li>
                                <li><span class="expediente-copy-alias" alias="#222#"><strong>Hora inhumación</strong>: #222#</span></li>
                                <li><span class="expediente-copy-alias" alias="#82#"><strong>Unidad de enterramiento</strong>: #82#</span></li>
                                <li><span class="expediente-copy-alias" alias="#83#"><strong>Nº nicho</strong>: #83#</span></li>
                                <li><span class="expediente-copy-alias" alias="#84#"><strong>Régimen</strong>: #84#</span></li>
                                <li><span class="expediente-copy-alias" alias="#206#"><strong>Exhumación de (1)</strong>: #206#</span></li>
                                <li><span class="expediente-copy-alias" alias="#207#"><strong>Fecha fallecimiento (1)</strong>: #207#</span></li>
                                <li><span class="expediente-copy-alias" alias="#228#"><strong>Exhumación de (2)</strong>: #228#</span></li>
                                <li><span class="expediente-copy-alias" alias="#229#"><strong>Fecha fallecimiento (2)</strong>: #229#</span></li>
                                <li><span class="expediente-copy-alias" alias="#230#"><strong>Exhumación de (2)</strong>: #230#</span></li>
                                <li><span class="expediente-copy-alias" alias="#231#"><strong>Fecha fallecimiento (2)</strong>: #231#</span></li>
                                <li><span class="expediente-copy-alias" alias="#85#"><strong>Titular</strong>: #85#</span></li>
                                <li><span class="expediente-copy-alias" alias="#86#"><strong>Altura del nicho</strong>: #86#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos Cremación</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#87#"><strong>Crematorio</strong>: #87#</span></li>
                                <li><span class="expediente-copy-alias" alias="#88#"><strong>Estado</strong>: #88#</span></li>
                                <li><span class="expediente-copy-alias" alias="#89#"><strong>Fecha inicio</strong>: #89#</span></li>
                                <li><span class="expediente-copy-alias" alias="#188#"><strong>Fecha inicio (día)</strong>: #188#</span></li>
                                <li><span class="expediente-copy-alias" alias="#189#"><strong>Fecha inicio (mes)</strong>: #189#</span></li>
                                <li><span class="expediente-copy-alias" alias="#190#"><strong>Fecha inicio (año)</strong>: #190#</span></li>
                                <li><span class="expediente-copy-alias" alias="#90#"><strong>Hora inicio</strong>: #90#</span></li>
                                <li><span class="expediente-copy-alias" alias="#91#"><strong>Fecha fin</strong>: #91#</span></li>
                                <li><span class="expediente-copy-alias" alias="#191#"><strong>Fecha fin (día)</strong>: #191#</span></li>
                                <li><span class="expediente-copy-alias" alias="#192#"><strong>Fecha fin (mes)</strong>: #192#</span></li>
                                <li><span class="expediente-copy-alias" alias="#193#"><strong>Fecha fin (año)</strong>: #193#</span></li>
                                <li><span class="expediente-copy-alias" alias="#92#"><strong>Hora fin</strong>: #92#</span></li>
                                <li><span class="expediente-copy-alias" alias="#93#"><strong>Técnico cremación</strong>: #93#</span></li>
                                <li><span class="expediente-copy-alias" alias="#94#"><strong>Id. trazabilidad</strong>: #94#</span></li>
                                <li><span class="expediente-copy-alias" alias="#95#"><strong>Empresa solicitante</strong>: #95#</span></li>
                                <li><span class="expediente-copy-alias" alias="#96#"><strong>CIF</strong>: #96#</span></li>
                                <li><span class="expediente-copy-alias" alias="#97#"><strong>Teléfono</strong>: #97#</span></li>
                                <li><span class="expediente-copy-alias" alias="#98#"><strong>Persona de contacto</strong>: #98#</span></li>
                                <li><span class="expediente-copy-alias" alias="#99#"><strong>Teléfono de contacto</strong>: #99#</span></li>
                                <li><span class="expediente-copy-alias" alias="#100#"><strong>Familiar de contacto</strong>: #100#</span></li>
                                <li><span class="expediente-copy-alias" alias="#101#"><strong>Apellidos</strong>: #101#</span></li>
                                <li><span class="expediente-copy-alias" alias="#165#"><strong>Apellido 1</strong>: #165#</span></li>
                                <li><span class="expediente-copy-alias" alias="#166#"><strong>Apellido 2</strong>: #166#</span></li>
                                <li><span class="expediente-copy-alias" alias="#102#"><strong>Teléfono</strong>: #102#</span></li>
                                <li><span class="expediente-copy-alias" alias="#103#"><strong>Entregar cenizas a</strong>: #103#</span></li>
                                <li><span class="expediente-copy-alias" alias="#104#"><strong>NIF/NIE/Pasaporte/Otro</strong>: #104#</span></li>
                                <li><span class="expediente-copy-alias" alias="#105#"><strong>Teléfono</strong>: #105#</span></li>
                                <li><span class="expediente-copy-alias" alias="#106#"><strong>Fecha</strong>: #106#</span></li>
                                <li><span class="expediente-copy-alias" alias="#194#"><strong>Fecha (día)</strong>: #194#</span></li>
                                <li><span class="expediente-copy-alias" alias="#195#"><strong>Fecha (mes)</strong>: #195#</span></li>
                                <li><span class="expediente-copy-alias" alias="#196#"><strong>Fecha (año)</strong>: #196#</span></li>
                                <li><span class="expediente-copy-alias" alias="#107#"><strong>Hora</strong>: #107#</span></li>
                                <li><span class="expediente-copy-alias" alias="#108#"><strong>Lugar</strong>: #108#</span></li>
                                <li><span class="expediente-copy-alias" alias="#109#"><strong>Control de emisiones - Peso carga</strong>: #109#</span></li>
                                <li><span class="expediente-copy-alias" alias="#110#"><strong>Control de emisiones - Escala Bacharach</strong>: #110#</span></li>
                                <li><span class="expediente-copy-alias" alias="#111#"><strong>Control de emisiones - Fecha medición</strong>: #111#</span></li>
                                <li><span class="expediente-copy-alias" alias="#197#"><strong>Control de emisiones - Fecha medición (día)</strong>: #197#</span></li>
                                <li><span class="expediente-copy-alias" alias="#198#"><strong>Control de emisiones - Fecha medición (mes)</strong>: #198#</span></li>
                                <li><span class="expediente-copy-alias" alias="#199#"><strong>Control de emisiones - Fecha medición (año)</strong>: #199#</span></li>
                                <li><span class="expediente-copy-alias" alias="#112#"><strong>Control de emisiones - Hora medición</strong>: #112#</span></li>
                                <li><span class="expediente-copy-alias" alias="#208#"><strong>Introducción</strong>: #208#</span></li>
                                <li><span class="expediente-copy-alias" alias="#209#"><strong>Espera en sala</strong>: #209#</span></li>
                                <li><span class="expediente-copy-alias" alias="#210#"><strong>Urna biodegradable</strong>: #210#</span></li>
                                <li><span class="expediente-copy-alias" alias="#211#"><strong>Féretro ecológico</strong>: #211#</span></li>
                                <li><span class="expediente-copy-alias" alias="#212#"><strong>Portador marcapasos</strong>: #212#</span></li>
                                <li><span class="expediente-copy-alias" alias="#213#"><strong>Hora llegada familia</strong>: #213#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos de personal y libro de registro</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#113#"><strong>Funeraria de servicio</strong>: #113#</span></li>
                                <li><span class="expediente-copy-alias" alias="#114#"><strong>Atención familia</strong>: #114#</span></li>
                                <li><span class="expediente-copy-alias" alias="#115#"><strong>Vehículo de recogida inicial</strong>: #115#</span></li>
                                <li><span class="expediente-copy-alias" alias="#116#"><strong>Recogida cadáver (1)</strong>: #116#</span></li>
                                <li><span class="expediente-copy-alias" alias="#117#"><strong>Recogida cadáver (2)</strong>: #117#</span></li>
                                <li><span class="expediente-copy-alias" alias="#118#"><strong>Vehículo de conducción</strong>: #118#</span></li>
                                <li><span class="expediente-copy-alias" alias="#119#"><strong>Lugar de destino intermedio</strong>: #119#</span></li>
                                <li><span class="expediente-copy-alias" alias="#120#"><strong>Lugar de destino final</strong>: #120#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos de Entrada</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#121#"><strong>Funeraria de procedencia</strong>: #121#</span></li>
                                <li><span class="expediente-copy-alias" alias="#122#"><strong>CIF</strong>: #122#</span></li>
                                <li><span class="expediente-copy-alias" alias="#123#"><strong>Teléfono</strong>: #123#</span></li>
                                <li><span class="expediente-copy-alias" alias="#124#"><strong>Fax</strong>: #124#</span></li>
                                <li><span class="expediente-copy-alias" alias="#125#"><strong>Fecha entrada</strong>: #125#</span></li>
                                <li><span class="expediente-copy-alias" alias="#200#"><strong>Fecha entrada (día)</strong>: #200#</span></li>
                                <li><span class="expediente-copy-alias" alias="#201#"><strong>Fecha entrada (mes)</strong>: #201#</span></li>
                                <li><span class="expediente-copy-alias" alias="#202#"><strong>Fecha entrada (año)</strong>: #202#</span></li>
                                <li><span class="expediente-copy-alias" alias="#126#"><strong>Hora entrada</strong>: #126#</span></li>
                                <li><span class="expediente-copy-alias" alias="#127#"><strong>Féretro</strong>: #127#</span></li>
                                <li><span class="expediente-copy-alias" alias="#128#"><strong>Práct. Tanatológica</strong>: #128#</span></li>
                                <li><span class="expediente-copy-alias" alias="#129#"><strong>Nombre</strong>: #129#</span></li>
                                <li><span class="expediente-copy-alias" alias="#130#"><strong>NIF/NIE/Pasaporte/Otro</strong>: #130#</span></li>
                                <li><span class="expediente-copy-alias" alias="#263#"><strong>Cámara refrigerada</strong>: #263#</span></li>
                                <li><span class="expediente-copy-alias" alias="#264#"><strong>Fecha Entrada en Cámara</strong>: #264#</span></li>
                                <li><span class="expediente-copy-alias" alias="#265#"><strong>Hora Entrada en Cámara</strong>: #265#</span></li>
                                <li><span class="expediente-copy-alias" alias="#266#"><strong>Fecha Salida de Cámara</strong>: #266#</span></li>
                                <li><span class="expediente-copy-alias" alias="#267#"><strong>Hora Salida de Cámara</strong>: #267#</span></li>
                                <li><span class="expediente-copy-alias" alias="#214#"><strong>Cadáver Grupo I</strong>: #214#</span></li>
                                <li><span class="expediente-copy-alias" alias="#215#"><strong>Judicial</strong>: #215#</span></li>
                                <li><span class="expediente-copy-alias" alias="#216#"><strong>Recogida</strong>: #216#</span></li>
                                <li><span class="expediente-copy-alias" alias="#217#"><strong>Devolución</strong>: #217#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Datos del Traslado</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#131#"><strong>Funeraria destino</strong>: #131#</span></li>
                                <li><span class="expediente-copy-alias" alias="#132#"><strong>CIF</strong>: #132#</span></li>
                                <li><span class="expediente-copy-alias" alias="#133#"><strong>Teléfono</strong>: #133#</span></li>
                                <li><span class="expediente-copy-alias" alias="#134#"><strong>Fax</strong>: #134#</span></li>
                                <li><span class="expediente-copy-alias" alias="#135#"><strong>Persona de contacto</strong>: #135#</span></li>
                                <li><span class="expediente-copy-alias" alias="#136#"><strong>Teléfono de contacto</strong>: #136#</span></li>
                                <li><span class="expediente-copy-alias" alias="#137#"><strong>Dirección</strong>: #137#</span></li>
                                <li><span class="expediente-copy-alias" alias="#138#"><strong>Fecha salida</strong>: #138#</span></li>
                                <li><span class="expediente-copy-alias" alias="#203#"><strong>Fecha salida (día)</strong>: #203#</span></li>
                                <li><span class="expediente-copy-alias" alias="#204#"><strong>Fecha salida (mes)</strong>: #204#</span></li>
                                <li><span class="expediente-copy-alias" alias="#205#"><strong>Fecha salida (año)</strong>: #205#</span></li>
                                <li><span class="expediente-copy-alias" alias="#139#"><strong>Hora salida</strong>: #139#</span></li>
                                <li><span class="expediente-copy-alias" alias="#140#"><strong>Origen - Provincia</strong>: #140#</span></li>
                                <li><span class="expediente-copy-alias" alias="#141#"><strong>Origen - Localidad</strong>: #141#</span></li>
                                <li><span class="expediente-copy-alias" alias="#261#"><strong>Origen - Código postal</strong>: #261#</span></li>
                                <li><span class="expediente-copy-alias" alias="#142#"><strong>Origen - Dirección</strong>: #142#</span></li>
                                <li><span class="expediente-copy-alias" alias="#143#"><strong>Destino - Provincia</strong>: #143#</span></li>
                                <li><span class="expediente-copy-alias" alias="#144#"><strong>Destino - Localidad</strong>: #144#</span></li>
                                <li><span class="expediente-copy-alias" alias="#262#"><strong>Destino - Código postal</strong>: #262#</span></li>
                                <li><span class="expediente-copy-alias" alias="#145#"><strong>Destino - Dirección</strong>: #145#</span></li>
                                <li><span class="expediente-copy-alias" alias="#146#"><strong>Vía</strong>: #146#</span></li>
                                <li><span class="expediente-copy-alias" alias="#147#"><strong>Destino final</strong>: #147#</span></li>
                                <li><span class="expediente-copy-alias" alias="#148#"><strong>Vehículo de traslado</strong>: #148#</span></li>
                                <li><span class="expediente-copy-alias" alias="#149#"><strong>Persona de traslado (1)</strong>: #149#</span></li>
                                <li><span class="expediente-copy-alias" alias="#150#"><strong>Persona de traslado (2)</strong>: #150#</span></li>
                                <li><span class="expediente-copy-alias" alias="#151#"><strong>Número de vuelo</strong>: #151#</span></li>
                                <li><span class="expediente-copy-alias" alias="#152#"><strong>Aeropuerto de salida</strong>: #152#</span></li>
                                <li><span class="expediente-copy-alias" alias="#249#"><strong>Fecha salida a destino</strong>: #249#</span></li>
                                <li><span class="expediente-copy-alias" alias="#153#"><strong>Hora salida a destino</strong>: #153#</span></li>
                                <li><span class="expediente-copy-alias" alias="#154#"><strong>Aeropuerto de destino</strong>: #154#</span></li>
                                <li><span class="expediente-copy-alias" alias="#248#"><strong>Fecha llegada a destino</strong>: #248#</span></li>
                                <li><span class="expediente-copy-alias" alias="#155#"><strong>Hora llegada a destino</strong>: #155#</span></li>
                                <li><span class="expediente-copy-alias" alias="#250#"><strong>Agencia/Consignataria</strong>: #250#</span></li>
                                <li><span class="expediente-copy-alias" alias="#251#"><strong>Persona de Contacto (Agencia/Consignataria)</strong>: #251#</span></li>
                                <li><span class="expediente-copy-alias" alias="#252#"><strong>Teléfono (Agencia/Consignataria)</strong>: #252#</span></li>
                                <li><span class="expediente-copy-alias" alias="#156#"><strong>Notas</strong>: #156#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span class="label label-primary">Observaciones</span>
                        </legend>
                        <div>
                            <ul>
                                <li><span class="expediente-copy-alias" alias="#223#"><strong>Notas</strong>: #223#</span></li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-upload-file" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Subir o seleccionar <strong>Imagen</strong></h4>
            </div>
            <div class="modal-body">
                <h4 for="image"><strong>Sube una imagen:</strong></h4>
                <div style="display:flex; justify-content:init; align-items:center; margin-bottom:15px">
                    <input type="file" id="image" accept="image/png">
                    <span class="badge badge-danger hide" id="emptyError">Debes seleccionar una imagen</span>
                    <span class="badge badge-danger hide" id="formatError">Formato de archivo no permitido (png)</span>
            
                    <button id="uploadImage" type="button" class="btn btn-primary" style="margin-top: 4px; margin-left:6px"><i class="fa fa-floppy-o" aria-hidden="true"></i> Subir imagen</button>
                    <button id="uploadImageGallery" type="button" class="btn btn-primary" style="margin-top: 4px; margin-left:6px"><i class="fa fa-floppy-o" aria-hidden="true"></i> Subir imagen y añadir a galería</button>
                </div>
                <hr style="margin-bottom:15px">
                <div id="loadingAddImage" class="hide" >Cargando...</div>
                <h4 id="selectAddImageText" class="hide"><strong>Selecciona una imagen:</strong></h4>
                <div class="row hide" id="imagesSources"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="chooseImage" disabled> Añadir imagen seleccionada</button>
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-delete-category-info" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Info</span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="alert alert-info">
                            No se puede eliminar una categoría si tiene plantillas de documentos creadas. Primero debes eliminar todas las plantillas para poder eliminar esta categoría.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade modalSave" id="modal-save" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="bolder">Guardar</span></h4>
            </div>
            <div class="modal-body" style="overflow: auto;">
                <p>El documento se está guardando.</p>
            </div>
        </div>
    </div>
</div>