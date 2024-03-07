<div>
    <table id="questionResponseTable" class="table table-bordered">
        <tr>
            <th></th>
            <th>
                {if !empty($MOD.LBL_QUESTION)}{$MOD.LBL_QUESTION}{/if}
            </th>
            <th>
                {if !empty($MOD.LBL_RESPONSE)}{$MOD.LBL_RESPONSE}{/if}
            </th>
        </tr>
        {foreach from=$questionResponses item=questionResponse}
            <tr>
                <td>Q{$questionResponse.sort_order+1}</td>
                <td>
                    {$questionResponse.questionName}
                </td>
                <td>
                    {$questionResponse.answer}
                </td>
            </tr>
        {/foreach}
    </table>
</div>
