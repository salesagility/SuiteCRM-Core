<form id="ConfigureSettings" name="ConfigureSettings" enctype='multipart/form-data' method="POST"
      action="index.php?module=Administration&action=BusinessHours&do=save">

<span class='error'>{$error.main}</span>

<table width="100%" cellpadding="0" cellspacing="0" border="0" class="actionsContainer">
    <tr>
        <td class="action-button">
            {$BUTTONS}
        </td>
    </tr>
</table>


<table width="100%" border="0" cellspacing="1" cellpadding="0" class="edit view">
<tr>
    <th align="left" scope="row" colspan="4"><h4>{$MOD.LBL_AOP_BUSINESS_HOURS_SETTINGS}</h4></th>
</tr>
    {foreach from=$DAY_DROPDOWNS key=day item=hours}
<tr>
<td width="10%">{$hours.label}</td>
<td width="10%" class="business-open">
    <label for="open_status_{$day}" class="business-lbl">{$MOD.LBL_BUSINESS_HOURS_OPEN}</label>
    <input data-day="{$day}" type="checkbox" id="open_status_{$day}" name="open_status_{$day}" class="open_check" {if $hours.open_status}checked="checked"{/if}>
</td>
<td>
    <div id="{$day}_times">{$MOD.LBL_BUSINESS_HOURS_FROM} 
    <select name="opening_time_{$day}" tabindex="0" id="opening_time_{$day}" style="margin-left:1em;">{$hours.opening}</select> <span style="margin-left:1em;">{$MOD.LBL_BUSINESS_HOURS_TO}</span> <select name="closing_time_{$day}" tabindex="0" id="closing_time_{$day}" style="margin-left:1em;">{$hours.closing}</select></div>
</td>
</tr>
    {/foreach}
</table>
<div class="hide-btn">
    {$BUTTONS}
</div>
{$JAVASCRIPT}
</form>
