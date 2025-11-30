<div class="modal fade" id="modal-new-invoice" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Crear <span class="bolder">Factura</span><span class="bolder" id="invoiceRectifiedTypeTitle"></span></h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning alert-dismissible fade in hide" role="alert" id="warningLastInvoice" style="margin-bottom:1em;"> 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
                    La última factura generada para la serie seleccionada es del <span id="lastDateInvoice"></span>. Debes generar la factura con una fecha igual o posterior a esta.
                </div>
                <div class="alert alert-warning alert-dismissible fade in hide" role="alert" id="warningYearsExpInvoices" style="margin-bottom:1em;"> 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
                    No es posible generar una factura para el año <span id="invoiceYearNotice"></span> de un expediente del año <span id="expYearNotice"></span>.
                </div>
                <div class="alert alert-warning alert-dismissible fade in hide" role="alert" id="warningRectified" style="margin-bottom:1em;"> 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
                    No es posible generar una factura rectificativa por diferencias si no se ha modificado ningún producto con respecto a la original.
                </div>
                <div class="alert alert-warning alert-dismissible fade in hide" role="alert" id="normalInvoiceTotalNegative" style="margin-bottom:1em;"> 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
                    No es posible generar una factura sin ser rectificativa con total igual o inferior a 0,00 €.
                </div>
                <form id="formNewInvoice" class="form-horizontal">
                    <div class="form-group">
                        <label for="paymentMethod" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Método de cobro:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <select id="paymentMethod">
                                <option value="Contado">Contado</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Giro bancario">Giro bancario</option>
                                <option value="Transferencia" selected>Transferencia</option>
                            </select>
                            <span class="inputError" id="paymentMethodError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="requestDateInvoice" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Fecha solicitud:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group">
                                <input type="text" size="15" class="form-control datepicker" id="requestDateInvoice" name="requestDateInvoice" aria-describedby="fecha" autocomplete="off" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="billingSerie" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Serie de facturación:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <select id="billingSerie" name="billingSerie" class="form-control"></select>
                            <div>
                                <span class="inputError" id="billingSerieError"></span>
                            </div>
                        </div>
                    </div>
                    <div id="rectifiedTypeSection" class="form-group hide">
                        <label for="rectifiedType" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Tipo de rectificación:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <select id="rectifiedType">
                                <option value="" selected>--</option>
                                <option value="1">Sustitutiva</option>
                                <option value="2">Diferencias</option>
                            </select>
                            <div>
                                <span class="inputError" id="rectifiedTypeError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="alert alert-info alert-dismissible fade in hide" role="alert" id="rectifiedSustitutionInfo" style="margin-bottom:1em;"> 
                        Si seleccionas el tipo de rectificación "Sustitutiva", se generará una nueva factura que sustituye completamente a la factura original.
                    </div>
                    <div class="alert alert-info alert-dismissible fade in hide" role="alert" id="rectifiedDifferencesInfo" style="margin-bottom:1em;"> 
                        Si seleccionas el tipo de rectificación "Diferencias", se generará una nueva factura que refleja únicamente las diferencias con respecto a la factura original.
                    </div>
                    <div class="form-group">
                        <label for="date" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Fecha factura:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div class="input-group date">
                                <input type="text" size="15" class="form-control datepicker" id="date" name="date" aria-describedby="fecha" autocomplete="off">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="comments" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Comentarios:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <textarea type="text" class="form-control" id="comments" name="comments" rows="4" cols="50"></textarea>
                            <span class="inputError" id="commentsError"></span>
                        </div>
                    </div>
                    <div class="form-group hide" id="bankDraftSection">
                        <label for="bankDraft" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Cuenta bancaria:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="text" class="form-control" id="bankDraft" name="bankDraft" size="40"></input>
                        </div>
                    </div>
                    <div class="form-group accounts">
                        <label for="accountNumber" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="accountText">Nº cuenta:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 accountNum">
                            <select id="accountNumber" class="form-control"></select>
                            <span class="inputError" id="accountNumberError"></span>
                        </div>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 hide tpvDiv">
                            <div class="form-group" style="margin-bottom: 0!important;">
                                <div class="input-group">
                                    <select id="tpv" class="form-control" style="margin-left: 15px;"></select>
                                    <span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-tpv" title="Nuevo TPV de Cobro"><i class="fa fa-plus"></i></a></span>
                                </div>
                                <span class="inputError" id="tpvError"></span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="protocolDiv">
                        <label for="protocol" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Protocolo de facturación</label>
                        <div class="col-xs-8">
                            <textarea type="text" class="form-control" id="protocol" rows="15" cols="50" disabled></textarea>
                            <span class="inputError" id="protocolError"></span>
                        </div>
                    </div>
                    <div class="form-group" id="docDiv">
                        <label for="fileupload" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label">Documentación</label>
                        <div class="col-xs-8">
                            <span class="btn btn-primary fileinput-button" id="fileuploadLbl" onclick="downloadDoc(this)">
                                <i class="fa fa-file-pdf-o c-black" aria-hidden="true"></i>
                                <span>Descargar archivo</span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group hide">
                        <label for="print" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="printLabel">Generar factura:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="saveInvoice"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-new-tpv" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">TPV de Cobro</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewTPV" name="formNewTPV">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="tpvNumAccount" class="col-xs-3 control-label">Núm. de Cuenta</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="tpvNumAccount" name="tpvNumAccount">
                            <span class="inputError" id="tpvNumAccountError"></span>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewTPV" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-texts" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Añadir <span class="bolder">Textos</span></h4>
            </div>
            <div class="modal-body">
                <form id="formNewText" class="form-horizontal">
                    <input type="hidden" id="textsIndex">
                    <input type="hidden" id="textsExpedient">
                    <input type="hidden" id="textsModel">
                    <div id="texts"></div>
                    <div class="modal-footer" id="textsBtnSave"></div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-print-invoice-logo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ver <span class="bolder">Factura</span></h4>
            </div>
            <div class="modal-body">
                <form id="formPrintLogoInvoice" class="form-horizontal">
                    <div class="form-group">
                        <label for="print" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="printLabel">Ver factura:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="viewInvoice"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Ver</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-print-budget-logo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="z-index: 11111;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Ver <span class="bolder">Presupuesto</span></h4>
            </div>
            <div class="modal-body">
                <form id="formPrintLogoBudget" class="form-horizontal">
                    <div class="form-group">
                        <label for="print" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="printLabel">Ver presupuesto:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                        </div>
                        <input id="budget" type="hidden">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="viewBudget"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Ver</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-generated-budget-logo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Generar <span class="bolder">Presupuesto</span></h4>
            </div>
            <div class="modal-body">
                <form id="formGenerateLogoBudget" class="form-horizontal">
                    <div class="form-group">
                        <label for="print" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="printLabel">Generar presupuesto:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                            <input type="checkbox" id="withoutName"> Sin nombre de fallecido<br>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="generateBudget"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Generar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-budgets-history" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Histórico <span class="bolder">de presupuestos</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="oID">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Presupuestos</span></legend>
                    <br>
                
                <div class="clearfix table-responsive">
                    <table id="listBudgets" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Acciones</th>                        
                            </tr>
                        </thead>
                        <tbody id="tableBody"></tbody>
                    </table>
                </div>
            </div>
            </fieldset>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-users-notes-thread" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close close-user-note-thread" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Seleccionar <span class="bolder">usuario</span></h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="usersNotesThread" class="col-sm-3 control-label">Usuarios:</label>
                    <div class="col-sm-9">
                        <select class="form-control select2" id="usersNotesThread"></select>
                        <p class="c-red hide" id="usersNotesThreadError">Debes seleccionar un usuario</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default close-user-note-thread" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button  id="selectUserThread" type="button" class="btn btn-primary"><i class="fa fa-save" aria-hidden="true"></i> Seleccionar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-generated-invoice-proforma" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Generar <span class="bolder">Factura Proforma</span></h4>
            </div>
            <div class="modal-body">
                <form id="formGenerateInvoiceProforma" class="form-horizontal">
                    <div class="form-group">
                        <label for="print" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 control-label" id="printLabel">Generar factura proforma:</label>
                        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button  id="generateInvoiceProforma" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Generar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-invoices-proforma-history" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Histórico <span class="bolder">de facturas proforma</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="oID">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Facturas Proforma</span></legend>
                    <br>
                
                <div class="clearfix table-responsive">
                    <table id="listInvoicesProforma" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Número</th>
                                <th>Fecha</th>
                                <th>Acciones</th>                        
                            </tr>
                        </thead>
                        <tbody id="tableBodyInvoicesProforma"></tbody>
                    </table>
                </div>
            </div>
            </fieldset>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-invoices-history" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Histórico <span class="bolder">de facturas</span></h4>
            </div>
            <div class="modal-body">
                <input type="hidden" id="oID">
                <fieldset>
                    <legend><span class="label label-primary labelLgExp">Facturas</span></legend>
                    <br>
                
                <div class="clearfix table-responsive">
                    <table id="listInvoices" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Número</th>
                                <th>Estado</th>
                                <th>Fecha factura</th>
                                <th>Fecha emisión</th>
                                <th>Usuario emisión</th>
                                <th>Acciones</th>                        
                            </tr>
                        </thead>
                        <tbody id="tableBodyInvoices"></tbody>
                    </table>
                </div>
            </div>
            </fieldset>
            <div id="warning-message"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
            </div>
        </div>
    </div>
</div>