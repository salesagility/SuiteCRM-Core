    <!-- tab_panel_content.tpl -->
    {{foreach name=rowIteration from=$panel key=row item=rowData}}
        <div class="row edit-view-row">
            {*row*}
            {{counter name="columnCount" start=0 print=false assign="columnCount"}}
            {{foreach name=colIteration from=$rowData key=col item=colData}}
                {*column*}
                {*<!-- COLUMN -->*}
                {{if $smarty.foreach.colIteration.total > 1 && $colData.colspan != 3}}
                    <div class="col-xs-12 col-sm-6 edit-view-row-item edit-view-bordered" data-field="{{$fields[$colData.field.name].name}}">
                {{else}}
                    <div class="col-xs-12 col-sm-12 edit-view-row-item" data-field="{{$fields[$colData.field.name].name}}">
                {{/if}}

                {{counter name="fieldCount" start=0 print=false assign="fieldCount"}}
                {{counter name="addressCount" start=0 print=false assign="addressCount"}}
                {{foreach name=fieldIteration from=$colData key=field item=subField}}

                    {{if !(!isset($subField.name) || !$subField.name)}}
                        {*<!-- [hide!!] -->*}

                    {{if $fieldCount < $smarty.foreach.colIteration.total && $addressCount < 1 && !empty($colData.field.name) && empty($colData.field.hideIf)}}
                        {{if !empty($colData.field.hideLabel) && $colData.field.hideLabel == true}}
                        {*hide label*}
                        {{else}}

                        {*<!-- LABEL -->*}
                        {{if $smarty.foreach.colIteration.total > 1 && $colData.colspan != 3}}
                            <div class="col-xs-12 col-sm-4 label" data-label="{{$fields[$colData.field.name].vname|default:''}}">
                        {{else}}
                             <div class="col-xs-12 col-sm-2 label" data-label="{{$fields[$colData.field.name].vname|default:''}}">
                        {{/if}}

                                {*label*}
                                {minify}
                                {{if isset($colData.field.customLabel)}}
                                <label for="{{$fields[$colData.field.name].name}}">{{$colData.field.customLabel}}</label>
                                {{elseif isset($colData.field.label)}}
                                    {capture name="label" assign="label"}{sugar_translate label='{{$colData.field.label}}' module='{{$module}}'}{/capture}
                                    {$label|strip_semicolon}:
                                {{elseif isset($fields[$colData.field.name].vname)}}
                                    {capture name="label" assign="label"}{sugar_translate label='{{$fields[$colData.field.name].vname}}' module='{{$module}}'}{/capture}
                                    {$label|strip_semicolon}:
                                {{else}}
                                    &nbsp;
                                {{/if}}
                                {* Show the required symbol if field is required, but override not set.  Or show if override is set *}
                                {{if (!empty($fields[$colData.field.name].required|default:'') && (!isset($colData.field.displayParams.required) || $colData.field.displayParams.required)) || (isset($colData.field.displayParams.required) && $colData.field.displayParams.required)}}
                                    <span class="required">{{$APP.LBL_REQUIRED_SYMBOL}}</span>
                                {{/if}}
                                {{if isset($colData.field.popupHelp) || isset($fields[$colData.field.name]) && isset($fields[$colData.field.name].popupHelp) }}
                                    {{if isset($colData.field.popupHelp)}}
                                        {{capture name="popupText" assign="popupText"}}
                                            {sugar_translate label="{$colData.field.popupHelp}" module='{{$module}}'}
                                        {{/capture}}
                                    {{elseif isset($fields[$colData.field.name].popupHelp)}}
                                        {capture name="popupText" assign="popupText"}
                                            {sugar_translate label="{{$fields[$colData.field.name].popupHelp}}" module='{{$module}}'}
                                        {/capture}
                                    {{/if}}
                                    {sugar_help text=$popupText WIDTH=-1}
                                {{/if}}
                                {/minify}
                            </div>
                        {{/if}}

                        {*<!-- VALUE -->*}
                        {{if !empty($colData.field.hideLabel) && $colData.field.hideLabel == true && $colData.colspan != 3}}
                            {{assign var="fieldClasses" value="col-xs-12 col-sm-12"}}
                        {{else}}
                            {{assign var="fieldClasses" value="col-xs-12 col-sm-8"}}
                        {{/if}}

                        <div class="{{$fieldClasses}} edit-view-field {{if isset($inline_edit) && !empty($colData.field.name|default:'') && ($fields[$colData.field.name].inline_edit|default:'' == 1 || !isset($fields[$colData.field.name].inline_edit|default:''))}}inlineEdit{{/if}}" type="{{$fields[$colData.field.name].type|default:'varchar'}}" field="{{$fields[$colData.field.name].name|default:$colData.field.name}}" {{if $colData.colspan}}colspan='{{$colData.colspan}}'{{/if}} {{if isset($fields[$colData.field.name].type) && $fields[$colData.field.name].type == 'phone'}}class="phone"{{/if}}>
                            {{if !empty($def.templateMeta.labelsOnTop)}}
                                {{if isset($colData.field.label)}}
                                    {{if !empty($colData.field.label)}}
                                        <label for="{{$fields[$colData.field.name].name}}">{sugar_translate label='{{$colData.field.label}}' module='{{$module}}'}:</label>
                                    {{/if}}
                                {{elseif isset($fields[$colData.field.name].vname)}}
                                    <label for="{{$fields[$colData.field.name].name}}">{sugar_translate label='{{$fields[$colData.field.name].vname}}' module='{{$module}}'}:</label>
                                {{/if}}

                                {* Show the required symbol if field is required, but override not set.  Or show if override is set *}
                                {{if ($fields[$colData.field.name].required && (!isset($colData.field.displayParams.required) || $colData.field.displayParams.required)) ||
                                     (isset($colData.field.displayParams.required) && $colData.field.displayParams.required)}}
                                    <span class="required" title="{{$APP.LBL_REQUIRED_TITLE}}">{{$APP.LBL_REQUIRED_SYMBOL}}</span>
                                {{/if}}

                                {{if !isset($colData.field.label) || !empty($colData.field.label)}}
                                    <br>
                                {{/if}}
                            {{/if}}

                            {{$colData.field.prefix}}

                            {{if $fields[$colData.field.name] && !empty($colData.field.fields)}}
                                {{foreach from=$colData.field.fields item=subField}}
                                    {{if $fields[$subField.name]}}
                                        {counter name="panelFieldCount" print=false}
                                        {{sugar_field parentFieldArray='fields'  accesskey=$ACCKEY tabindex=$subfields.tabindex|default:'' vardef=$fields[$subField.name] displayType='EditView' displayParams=$subField.displayParams|default:[] formName=$form_name module=$module}}&nbsp;
                                    {{/if}}
                                {{/foreach}}
                            {{elseif !empty($colData.field.customCode) && empty($colData.field.customCodeRenderField)}}
                                {counter name="panelFieldCount"  print=false}
                                {{sugar_evalcolumn var=$colData.field.customCode colData=$colData  accesskey=$ACCKEY tabindex=$colData.field.tabindex}}
                            {{elseif $fields[$colData.field.name]}}
                                {counter name="panelFieldCount" print=false}
                                {{$colData.displayParams|default:''}}
                                {{sugar_field parentFieldArray='fields'  accesskey=$ACCKEY tabindex=$colData.field.tabindex|default:'' vardef=$fields[$colData.field.name] displayType='EditView' displayParams=$colData.field.displayParams|default:[] typeOverride=$colData.field.type formName=$form_name module=$module}}
                            {{/if}}

                            {{if !empty($colData.field.customCode) && !empty($colData.field.customCodeRenderField)}}
                                {counter name="panelFieldCount"}
                                {{sugar_evalcolumn var=$colData.field.customCode colData=$colData tabindex=$colData.field.tabindex}}
                            {{/if}}
                            </div>
                            <div class="edit-dotted-border"></div>
                    {{else}}

                    {{/if}}

                    {{if $inline_edit && !empty($colData.field.name) && ($fields[$colData.field.name].inline_edit == 1 || !isset($fields[$colData.field.name].inline_edit))}}<div class="inlineEditIcon col-xs-1">
                        {sugar_getimage name="inline_edit_icon.svg" attr='border="0" ' alt="$alt_edit"}
                        </div>
                    {{/if}}

                    {*Field Exceptions*}
                    {{if !empty($colData.field.type)}}
                        {{if $colData.field.type == 'address'}}
                             {{counter name="addressCount" print=false}}
                        {{/if}}
                    {{/if}}

                        <!-- [/hide] -->
                    {{/if}}

                    {{counter name="fieldCount" print=false}}
                {{/foreach}}
                </div>
                {{if intval($col)%2==1}}
                <div class="clear"></div>
                {{/if}}
            {{/foreach}}
            {{if $columnCount==0}}
            <div class="clear"></div>
            {{/if}}
            {{counter name="columnCount" print=false}}
        </div>
    {{/foreach}}
