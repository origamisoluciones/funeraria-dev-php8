<div class="modal fade" id="modal-print-budget-logo" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
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
                            <input type=hidden id="expID" name="expID">
                            <input type=hidden id="budgetID">
                            <input type="radio" id='withLogo' name="print" value="1" checked> Con logo<br>
                            <input type="radio" id='withoutLogo' name="print" value="0"> Sin logo<br>
                        </div>
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