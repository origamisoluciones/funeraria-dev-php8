<div id="modal-note-preview" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal-note-preview" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Vista previa de la <span class="bolder">Esquela</span></h4>
            </div>
            <div class="modal-body">
                <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs">
                        <li class="pull-left dropdown active">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                Modelos de Esquela <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_1" data-toggle="tab">Cruceiro</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_2" data-toggle="tab">Cruz</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_3" data-toggle="tab">Paloma</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_4" data-toggle="tab">Ángeles</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_5" data-toggle="tab">Sin Foto</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_6" data-toggle="tab">Cruceiro 2</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1" href="#tab_7" data-toggle="tab">Foto difunto</a></li>
                            </ul>
                        </li>
                        <li class="pull-right"><a href="#"><i class="fa fa-refresh" aria-hidden="true"></i> RECARGAR DATOS</a></li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab_1">
                            <form id="formEditNote" name="formEditNote" class="clearfix form-horizontal" action="" method="POST">
                                <blockquote>
                                    <p>Modelo <span class="bolder">Cruceiro</span></p>
                                </blockquote>
                                <div id="editable" contenteditable="true">
                                    <?php include("../../view/expedient/note-template-1.php"); ?>
                                </div>
                            </form>
                        </div>
                        <div class="tab-pane" id="tab_2">
                        </div>
                        <div class="tab-pane" id="tab_3">
                        </div>
                        <div class="tab-pane" id="tab_4">
                        </div>
                        <div class="tab-pane" id="tab_5">
                        </div>
                        <div class="tab-pane" id="tab_6">
                        </div>
                        <div class="tab-pane" id="tab_7">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                <button type="button" class="btn btn-danger btn-sm"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
                <button type="button" class="btn btn-primary btn-sm"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>
            </div>
        </div>
    </div>
</div>