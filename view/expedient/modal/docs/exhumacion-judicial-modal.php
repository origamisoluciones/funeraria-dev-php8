<div id="exhumacion-judicial-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exhumacion-judicial-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form class="form-horizontal" id="formActaPreparacion" name="formActaPreparacion" method="POST" action="<?php echo $utils->getRoute().'documento/nuevo/' . $expedientID . '/exhumacionJudicial'; ?>">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Exhumación judicial</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <p>Att. Juzgado <input type="text" name="attention"></p>
                            <p>Diligencias: <input type="text" name="diligence"> del Juzgado de Instrucción <input type="text" name="tribunal"></p>
                            <p>Fecha: <input type="text" name="date"></p>
                            <br>
                            <p>
                                D/Dña. <input type="text" name="applicantName">, mayor de edad, con DNI Nº: <input type="text" name="applicantDni"> y
                                domicilio en <input type="text" name="applicantLocation">, en mi propio nombre y derecho, ante el Juzgado <input type="text" name="attention2">,
                                comparezco y como mejor proceda,</p>
                            <br>
                            <p>DIGO:</p>
                            <br>
                            <p>
                                Que con fecha <input type="text" name="date2">, este juzgado instruyó las Diligencias identificadas con el Nº <input type="text" name="diligence2">,
                                referentes al fallecimiento en <input type="text" name="reason"> de mi <input type="text" name="parent">, en la localidad
                                de ... . Los restos mortales de mi padre están enterrados en el Cementerio de ... (...) y quisiéramos proceder a la incineración de sus restos, para lo cual
                            </p>
                            <br>
                            <p>SOLICITO:</p>
                            <br>
                            <p>
                                Tengan a bien proceder a emitir un escritor/autorización para que la empresa funeraria ..., con domicilio en ..., pueda proceder a la incineración de
                                dichos restos en su Crematorio. Para lo cual
                            </p>
                            <p>
                                <ul>
                                    <li>Certificación Literal de Defunción del Registro Civil de <input type="text" name="civil"></li>
                                    <li>Copia Libro de Familia</li>
                                    <li>Copia DNI</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
                    <button type="submit" class="btn btn-danger btn-sm" id="goJudicial"><i class="fa fa-file-pdf-o" aria-hidden="true" target="_blank"></i> Crear PDF</button>
                </div>
            </form>                
        </div>
    </div>
</div>