<div class="modal fade" id="modal-new-product" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Nuevo <span class="bolder">Producto</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewProduct" name="formNewProduct">
                <div id="msg"></div>
                    <fieldset>
                        <legend><span class="label label-primary labelLgExp">Producto</legend>
                        <div class="form-group">
                            <label for="productName" class="col-xs-2 control-label">Producto</label>
                            <div class="col-xs-10">     
                                <input type="text" size="30" id="productName" name="productName" class="form-control" autocomplete="none">
                                <span class="inputError" id="productNameError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="productTypeID" class="col-xs-2 control-label">Tipo</label>
                            <div class="col-xs-10">     
                                <select id="productTypeID" name="productTypeID" class="form-control select2"></select>
                                <span class="inputError" id="productTypeIDError"></span>
                                <button type="button" class="btn btn-primary" id="showInfo">Info</button>
                            </div>
                        </div>
                        <div class="hide" id="typeInfo">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp"><strong>Tipos</strong></legend>    
                                <p>- <strong>Stock:</strong> Producto vinculado al servicio y que se guarda en el almacén.</p>
                                <p>- <strong>Subcontratado:</strong> Producto vinculado al servicio y que no se guarda en el almacén.</p>
                                <p>- <strong>Libre:</strong> Producto que no está vinculado al servicio y que se guarda en el almacén.</p>
                            </fieldset>
                        </div>
                        <div class="form-group hide">
                            <label for="productClassID" class="col-xs-2 control-label">Clase</label>
                            <div class="col-xs-10">     
                                <select id="productClassID" name="productClassID" class="form-control select2"></select>
                                <span class="inputError" id="productClassIDError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="IVATypeID" class="col-xs-2 control-label"><?= $ivaLabel ?></label>
                            <div class="col-xs-10">     
                                <select id="IVATypeID" name="IVATypeID" class="form-control select2"></select>
                                <span class="inputError" id="IVATypeIDError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-11">
                                    <label class="checkbox-inline hide">
                                        <input type="checkbox" id="press" name="press"> Prensa 
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="supplied" name="supplied"> Suplido
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="isInvoiced" name="isInvoiced"> <span class="bolder">No facturable</span>
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="amount" name="amount"> Cantidad
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="texts" name="texts"> Texto
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="preOrder" name="preOrder"> Genera pedido
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="editPrice" name="editPrice"> Editar precio en Contratación
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="isBus" name="isBus"> Autobús
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="isArca" name="isArca"> Arca O.T.
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="orderType" class="col-xs-4 control-label">Tipo de producto (Pedidos)</label>
                            <div class="col-xs-8">     
                                <select name="orderType" id="orderType">
                                    <option value="0" selected>Producto relativo al expediente</option>
                                    <option value="1">Producto libre</option>
                                    <option value="2">Producto del control de visitas</option>
                                    <option value="3">Producto relativo al control de servicio</option>
                                </select>
                                <button type="button" class="btn btn-primary" id="showInfoOrders">Info</button>
                            </div>
                        </div>
                        <div class="hide" id="typeInfoOrders">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Tipos de producto (Pedidos)</legend>
                                <p>- <strong>Producto relativo al expediente:</strong> Estos productos aparecen en la contratación del servicio.</p>
                                <p>- <strong>Producto libre:</strong> Productos ajenos al servicio.</p>
                                <p>- <strong>Producto del control de visitas:</strong> Productos principalmente de cafetería que aparecen en el Control de Visitas.</p>
                                <p>- <strong>Producto del control de servicio:</strong> Productos que aparecen en el Control de Servicio.</p>
                            </fieldset>
                        </div>
                        <div class="form-group <?php if($_SESSION['company'] != '3'){ ?> hide <?php } ?>">
                            <label for="timelineType" class="col-xs-4 control-label">Tipo de producto (Timeline)</label>
                            <div class="col-xs-8">     
                                <select name="timelineType" id="timelineType">
                                    <option value="0" selected>-</option>
                                    <option value="1">Autobús</option>
                                    <option value="2">Curas</option>
                                    <option value="3">Enterradores</option>
                                    <option value="4">Flores</option>
                                    <option value="5">Recordatorios</option>
                                    <option value="6">Taxi</option>
                                </select>
                                <button type="button" class="btn btn-primary" id="showInfoTimeline">Info</button>
                            </div>
                        </div>
                        <div class="hide" id="typeInfoTimeline">
                            <fieldset>
                                <legend><span class="label label-primary labelLgExp">Tipos de producto (Timeline)</legend>
                                <p>Los productos que tengan esta categoría seleccionada se tendrán en cuenta a la hora de medir sus <strong>tareas pendientes</strong> en el Timeline utilizando las horas de antelación que se pueden definir en la sección <i>Ajustes de tiempo</i> en <strong>Configuración/Ajustes</strong>.</p>
                            </fieldset>
                        </div>
                    </fieldset>
                    <div id="divHiringOrderSection">
                        <fieldset id="hiringOrderSection">
                            <legend><span class="label label-primary labelLgExp">Orden para la contratación</legend>
                            <div class="form-group">
                                <label for="blockBelow" class="col-xs-4 control-label">Pertenece al bloque de</label>
                                <div class="col-xs-8">     
                                    <select id="blockBelow">
                                        <option value="1">Servicio fúnebre</option>
                                        <option value="2">Inhumación</option>
                                        <option value="3">Flores</option>
                                        <option value="4">Transporte</option>
                                        <option value="5">Velación</option>
                                        <option value="6">Crematorio</option>
                                        <option value="7">Servicio judicial</option>
                                        <option value="8">Prensa</option>
                                        <option value="9">Suplidos</option>
                                        <option value="10">Otros</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="productName" class="col-xs-4 control-label">Orden</label>
                                <div class="col-xs-8">     
                                    <input type="number" size="10" id="orderBy" name="orderBy" class="form-control" autocomplete="none">
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div id="divServiceBlockSection">
                        <fieldset id="serviceOrderSection">
                            <legend><span class="label label-primary labelLgExp">Relativo al Control de Servicio - Grupo </legend>
                            <div class="form-group">
                                <label for="serviceBelow" class="col-xs-4 control-label">Grupo de Productos (C. Servicio)</label>
                                <div class="col-xs-8">     
                                    <select id="serviceBelow">
                                        <option value="0">Ninguno</option>
                                        <option value="1">Enterradores</option>
                                        <option value="2">Curas</option>
                                        <option value="3">Coros</option>
                                        <option value="4">Campaneros</option>
                                        <option value="5">Coronas</option>
                                        <option value="6">Centros</option>
                                        <option value="7">Otras composiciones (flores)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-1">
                                    <br>
                                </div>
                                <div class="col-xs-8">     
                                    <input type="checkbox" id="checkCService" name="checkCService"> <span>Visible en Control de Servicio (Otros)</span>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div id="divServiceProductSection" class="hide">                 
                        <fieldset id="ServiceProductSection">
                              <legend><span class="label label-primary labelLgExp">Tipo de producto para servicio</legend>
                            <div class="form-group">
                                <label for="productServiceTypeID" class="col-xs-4 control-label">Pertenece al tipo</label>
                                <div class="col-xs-8">
                                    <select id="productServiceTypeID" name="productServiceTypeID" class="form-control"></select>
                                    <span class="inputError" id="productServiceTypeError"></span>  
                                </div>
                            </div>                        
                        </fieldset>
                    </div>
                    <fieldset id="actionsSection">
                          <legend><span class="label label-primary labelLgExp">Acciones de producto</legend>
                        <div class="form-group">
                            <div class="col-xs-offset-1 col-xs-10" id="actions"></div>
                        </div>
                    </fieldset>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewProduct" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>