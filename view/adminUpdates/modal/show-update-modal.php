<div class="modal fade" id="modal-show-update" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title bolder" id="titleInfo"></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formShowData" name="formShowData">
                    <input type="hidden" id="updateID">
                    <div id="message" style="padding-left:20px;padding-right:20px;margin-top:1em;margin-bottom:1em;"></div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>
                        <button  id="exportUpdate"  type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> PDF</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>