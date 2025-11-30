<div id="acta-preparacion-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="acta-preparacion-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/actaPreparacion'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Acta de <span class="bolder">preparación</span></h4>
                </div>
                <div class="modal-body">
                    <div class="form-check col-md-12 col-lg-12">
                        <label class="form-check-label col-md-2 col-lg-2" for="pickPerson">Agente que recoge</label>
                        <div class="radio col-md-3 col-lg-3">
                            <select name="pickPerson" id="pickPerson"></select>
                        </div>
                        <div id="otherAgent" class="col-md-6 col-lg-6 hide" style="margin-top:10px">
                            <div class="form-check col-md-12 col-lg-12">   
                                <label class="col-md-3 col-lg-3" for="cleaning">Nombre</label> 
                                <input class="form-control" id="otherPickPerson" size="30" name="otherPickPerson" placeholder="Nombre">
                            </div>
                        </div> 
                    </div>
                    <div class="form-check col-md-12 col-lg-12">
                        <label class="form-check-label col-md-4 col-lg-4" for="deceasedIdentify">Identificación del fallecido</label>
                        <div class="radio col-md-2 col-lg-2">
                            <label class="radio-inline"><input type="radio" name="deceasedIdentify" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="deceasedIdentify" value="SI">SI</label>
                        </div>
                        <div class="col-xs-5">
                            <textarea class="form-control" rows="2" id="deceasedIdentifyText" name="deceasedIdentifyText" placeholder="Observaciones" style="width: 100% !important"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">
                        <label class="form-check-label col-md-4 col-lg-4" for="cadaverDress">El cadáver viene vestido</label>
                        <div class="radio col-md-2 col-lg-2">
                            <label class="radio-inline"><input type="radio" name="cadaverDress" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="cadaverDress" value="SI">SI</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="deliverClothing">Entrega ropa para amortajamiento</label>
                        <div class="radio col-md-2 col-lg-2">
                            <label class="radio-inline"><input type="radio" name="deliverClothing" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="deliverClothing" value="SI">SI</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="revisedClothing">Se revisa la ropa</label>
                        <div class="radio col-md-2 col-lg-2">
                            <label class="radio-inline"><input type="radio" id="revisedClothing1" name="revisedClothing" value="NO" checked disabled>NO</label>
                            <label class="radio-inline"><input type="radio" id="revisedClothing2" name="revisedClothing" value="SI" disabled>SI</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="belongings">Lleva pertenencias</label>
                        <div class="radio col-md-2 col-lg-2">
                            <label class="radio-inline"><input type="radio" name="belongings" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="belongings" value="SI">SI</label>
                        </div>
                        <label>Firmado por:</label>
                        <div class="col-md-6 col-lg-6">
                            
                            <div class="form-check col-md-12 col-lg-12">                    
                                <label class="col-md-3 col-lg-3" for="cleaning">Familiar</label>
                                <input class="form-control" id="familyText" size="20" name="familyText" placeholder="Familia">
                            </div>
                            <div class="form-check col-md-12 col-lg-12">   
                                <label class="col-md-3 col-lg-3" for="cleaning">Personal</label> 
                                <select class="form-control"  id="clientText" name="clientText" style="width: 192px !important;">
                                    <option value="" disabled selected>Personal</option>
                                </select>
                            </div>
                        </div> 
                        <div class="col-md-3 col-lg-6">
                        </div>                                              
                        <div class="col-md-3 col-lg-6" style="margin-bottom:10px">
                            <textarea class="form-control hide" rows="2" cols="28" id="belongingsText" name="belongingsText" placeholder="Objetos encontrados"></textarea>
                        </div>                                              
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="accesories">Vendas, cánulas, implantes retirados</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="accesories" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="accesories" value="SI">SI</label>
                            <label class="radio-inline"><input type="radio" name="accesories" value="N/A(1)">N/A(1)</label>
                        </div>
                        <div class="col-md-3 col-md-offset-2 col-lg-3 col-lg-offset-2">
                            <textarea class="form-control hide" rows="2" cols="28" id="accesoriesText" name="accesoriesText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="cleaning">Lavado superficial</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="cleaning" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="cleaning" value="SI">SI</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="holes">Cierre de orificios, relajamiento de expresión</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="holes" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="holes" value="SI">SI</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="shavedOff">Afeitado</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="shavedOff" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="shavedOff" value="SI">SI</label>
                            <label class="radio-inline"><input type="radio" name="shavedOff" value="N/A(1)">N/A(1)</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="hairpieces">Sustitución de dentaduras postizas</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="hairpieces" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="hairpieces" value="SI">SI</label>
                            <label class="radio-inline"><input type="radio" name="hairpieces" value="N/A(1)">N/A(1)</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="eyesMouth">Cierre de ojos y/o boca</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="eyesMouth" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="eyesMouth" value="SI">SI</label>
                            <label class="radio-inline"><input type="radio" name="eyesMouth" value="N/A(1)">N/A(1)</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="cosmetic">Peinado, peluquería, aplicación cosmética</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="cosmetic" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="cosmetic" value="SI">SI</label>
                            <label class="radio-inline"><input type="radio" name="cosmetic" value="N/A(1)">N/A(1)</label>
                        </div>
                    </div>
                    <div class="form-check col-md-12 col-lg-12">                    
                        <label class="form-check-label col-md-4 col-lg-4" for="reconstructive">Tratamiento reconstructivo</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="reconstructive" value="NO" checked>NO</label>
                            <label class="radio-inline"><input type="radio" name="reconstructive" value="SI">SI</label>
                            <label class="radio-inline"><input type="radio" name="reconstructive" value="N/A(1)">N/A(1)</label>
                        </div>
                        <div class="col-md-3 col-md-offset-2 col-lg-3 col-lg-offset-2">
                            <textarea class="form-control hide" rows="2" cols="28" id="reconstructiveText" name="reconstructiveText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <hr>
                    <div class="form-check col-md-12 col-lg-12" style="margin-top:15px">  
                        <h4>ENFERETRAMIENTO</h4>
                    </div>
                    <hr>
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-6 col-lg-6" for="position">Posición del difunto</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="positionRadio" value="C" checked>C</label>
                            <label class="radio-inline"><input type="radio" name="positionRadio" value="NC">NC</label>
                        </div>
                        <div class="col-md-3 col-lg-3">
                            <textarea class="form-control" rows="2" id="positionText" name="positionText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-6 col-lg-6" for="hairstyleText">Peinado</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="hairstyleTextRadio" value="C" checked>C</label>
                            <label class="radio-inline"><input type="radio" name="hairstyleTextRadio" value="NC">NC</label>
                        </div>
                        <div class="col-md-3 col-lg-3">
                            <textarea class="form-control" rows="2" id="hairstyleText" name="hairstyleText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-6 col-lg-6" for="insideText">Interior ataúd</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="insideTextRadio" value="C" checked>C</label>
                            <label class="radio-inline"><input type="radio" name="insideTextRadio" value="NC">NC</label>
                        </div>
                        <div class="col-md-3 col-lg-3">
                            <textarea class="form-control" rows="2" id="insideText" name="insideText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-6 col-lg-6" for="cleaningText">Limpieza y brillo de ataúd</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="cleaningTextRadio" value="C" checked>C</label>
                            <label class="radio-inline"><input type="radio" name="cleaningTextRadio" value="NC">NC</label>
                        </div>
                        <div class="col-md-3 col-lg-3">
                            <textarea class="form-control" rows="2" id="cleaningText" name="cleaningText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-6 col-lg-6" for="articlesText">Artículos personales</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="articlesTextRadio" value="C" checked>C</label>
                            <label class="radio-inline"><input type="radio" name="articlesTextRadio" value="NC">NC</label>
                        </div>
                        <div class="col-md-3 col-lg-3">
                            <textarea class="form-control" rows="2" id="articlesText" name="articlesText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="form-check col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">                    
                        <label class="form-check-label col-md-6 col-lg-6" for="stateText">Estado del ataúd</label>
                        <div class="radio col-md-3 col-lg-3">
                            <label class="radio-inline"><input type="radio" name="stateTextRadio" value="C" checked>C</label>
                            <label class="radio-inline"><input type="radio" name="stateTextRadio" value="NC">NC</label>
                        </div>
                        <div class="col-md-3 col-lg-3">
                            <textarea class="form-control" rows="2" id="stateText" name="stateText" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>