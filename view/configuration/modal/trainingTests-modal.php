<div class="modal fade" id="modal-new-trainingTest" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Añadir <span class="bolder">Curso</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formNewData" name="formNewData">
                    <div id="msg"></div>
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre del curso</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date" class="col-xs-3 control-label">Fecha de realización</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="date" name="date" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="duration" class="col-xs-3 control-label">Duración</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" min="1" step='0.25' class="form-control" id="duration" name="duration" autocomplete="none">
                            <span class="inputError" id="durationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dateReview" class="col-xs-3 control-label">Fecha de evaluación</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="dateReview" name="dateReview" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateReviewError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="result" class="col-xs-3 control-label">Resultado</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="result" name="result">
                                <option value="0" selected>No Apto</option>
                                <option value="1">Apto</option>
                                <option value="2">Pte. Evaluación</option>
                            </select>
                            <span class="inputError" id="resultError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="notes" class="col-xs-3 control-label">Criterio evaluación</label>
                        <div class="col-xs-9">
                            <textarea type="text" class="form-control" id="notes" rows="15" cols="60"></textarea>
                            <span class="inputError" id="notesError"></span>
                        </div>
                    </div>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-6">
                            <div class="col-xs-6" style="margin-top:1%">
                                <label>Adjuntar archivos</label>
                            </div>
                            <div class="col-xs-6">
                                <input type="file" style="border:0; margin-left:-10%;" class="form-control" name="fileAttachDocMultiple" id="fileAttachDocMultiple" accept=".pdf" multiple>
                            </div>
                        </div>
                    </div> 
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-12">
                            <div id="fileAttachDocMultipleSection" style="margin-left:2%"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveNewTrainingTest" type="button" class="btn btn-primary "><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-edit-trainingTest" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Editar <span class="bolder">Curso</span></h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="formEditData" name="formEditData">
                    <div id="msg"></div>
                    <input type="hidden" id="testID" name="testID" value="">
                    <div class="form-group">
                        <label for="name" class="col-xs-3 control-label">Nombre del curso</label>
                        <div class="col-xs-9">
                            <input type="text" size="30" class="form-control" id="name" name="name" autocomplete="none">
                            <span class="inputError" id="nameError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date" class="col-xs-3 control-label">Fecha de realización</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="date" name="date" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="duration" class="col-xs-3 control-label">Duración</label>
                        <div class="col-xs-9">
                            <input type="number" size="30" min="1" step='0.25' class="form-control" id="duration" name="duration" autocomplete="none">
                            <span class="inputError" id="durationError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dateReview" class="col-xs-3 control-label">Fecha de evaluación</label>
                        <div class="col-xs-9">
                            <div class="input-group date">
                                <input type="text" size="30" class="form-control datepicker" id="dateReview" name="dateReview" autocomplete="none">
                                <div class="input-group-addon">
                                    <i class="fa fa-calendar"></i>
                                </div>
                            </div>
                            <span class="inputError" id="dateReviewError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="result" class="col-xs-3 control-label">Resultado</label>
                        <div class="col-xs-9">
                            <select class="form-control select2" id="result" name="result">
                                <option value="0" selected>No Apto</option>
                                <option value="1">Apto</option>
                                <option value="2">Pte. Evaluación</option>
                            </select>
                            <span class="inputError" id="resultError"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="notes" class="col-xs-3 control-label">Criterio evaluación</label>
                        <div class="col-xs-9">
                            <textarea type="text" class="form-control" id="notes" rows="15" cols="60"></textarea>
                            <span class="inputError" id="notesError"></span>
                        </div>
                    </div>
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-6">
                            <div class="col-xs-6" style="margin-top:1%">
                                <label>Adjuntar archivos</label>
                            </div>
                            <div class="col-xs-6">
                                <input type="file" style="border:0; margin-left:-10%;" class="form-control" name="fileAttachDocMultiple" id="fileAttachDocMultiple" accept=".pdf" multiple>
                            </div>
                        </div>
                    </div> 
                    <div class="row form-group" style="margin-top:2%">
                        <div class="col-xs-12">
                            <div id="fileAttachDocMultipleSection" style="margin-left:2%"></div>
                        </div>
                    </div>
                    <div id="warning-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                        <button id="saveEditTrainingTest" type="button" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>