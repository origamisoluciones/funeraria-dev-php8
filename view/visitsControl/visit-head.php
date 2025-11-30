<input type="hidden" id="visitID" name="visitID" value="<?php echo $visitId; ?>">
<input type="hidden" id="url" name="url" value="<?php echo $_SERVER['REQUEST_URI']; ?>">
<fieldset>
    <legend><span class="label label-primary labelLgExp">Ficha del expediente</span></legend>
    <div class="row clearfix">
        <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
            <dl class="dl-horizontal">
                <dt>Nº Expediente</dt>
                <dd>
                    <span id="expedientNumber" name="expedientNumber" class="label label-warning medium bolder"></span>
                </dd>
            </dl>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
            <dl class="dl-horizontal">
                <dt>Fallecido</dt>
                <dd id="expedientDeceasedName" name="expedientDeceasedName"></dd>
                <dt>Fecha Entrada</dt>
                <dd id="funeralEntryDate" name="funeralEntryDate"></dd>
                <dt>Fecha Velación</dt>
                <dd id="startVelacionDate" name="startVelacionDate"></dd>
                <dt>Fecha inhumación</dt>
                <dd id="funeralDate" name="funeralDate"></dd>
                
            </dl>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
            <dl class="dl-horizontal">
                <dt>Casa mortuoria</dt>
                <dd id="expedientMortuoryName" name="expedientMortuoryName"></dd>
                <dt>Sala Nº</dt>
                <dd id="expedientRoom" name="expedientRoom"></dd>
            </dl>
        </div>
    </div>
</fieldset>