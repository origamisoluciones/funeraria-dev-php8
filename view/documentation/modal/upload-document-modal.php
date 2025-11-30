<div class="modal fade" id="modal-upload-document" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Adjuntar documentación</span></h4>
            </div>
            <div id="block-modal-messages"></div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-12">
                        <p>Formatos de archivo permitidos:</p>
                        <p><strong> .rar .zip .mp3 .doc .docx .dot .odt .pdf .txt .xls .xlsx .ppt .pptx .csv .svg .bmp .gif .jpeg .jpg .png .psd .tiff .avi .flv .mkv .mpeg</strong></p>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-xs-6">
                        <input type="file" class="form-control" name="fileAttachDocument[]" id="fileAttachDocument" multiple>
                        <span class="inputError" id="documentError"></span>
                        <span class="label label-danger hide" id="formatError">El formato de archivo no está permitido</span>
                    </div>
                    <div class="col-xs-6">
                        <button type="button" id="uploadFileDoc" class="btn btn-sm btn-primary"><i class="fa fa-cloud-upload" aria-hidden="true"></i> AÑADIR DOCUMENTACIÓN</button>       
                    </div>                                       
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cerrar</button>                         
            </div> 
        </div>
    </div>
</div>