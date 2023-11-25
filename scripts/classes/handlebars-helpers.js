/* ==================================================== */
/* =============== Handlebars Helpers ================= */
/* ==================================================== */

//Handlenars helper to get bonus description/Name from data model
Handlebars.registerHelper('defend_form_get_bonus_name', function (playerBonusInfo, options){
    let retVal;
    if(playerBonusInfo.isBonusOverridden)
    {
        retVal = playerBonusInfo.OverrideBonus.BonusName;
    }else{
        retVal = playerBonusInfo.DefaultBonus.BonusName;
    }
    return String(retVal);
});

//Handlebars helper to get bonus value from data model
Handlebars.registerHelper('defend_form_get_bonus_value', function (playerBonusInfo, options){
    let retVal;
    if(playerBonusInfo.isBonusOverridden)
    {
        retVal = playerBonusInfo.OverrideBonus.BonusValue;
    }else{
        retVal = playerBonusInfo.DefaultBonus.BonusValue;
    }
    return String(retVal);
});

//Handlebars helper used to display check on or off on the checkboxes
Handlebars.registerHelper('defend_form_IsChecked', function (bool, options) {
    if(bool){
        return 'checked="checked"'
    }
    return ""
});

//Handlebars helper used to display check on or off on the checkboxes
Handlebars.registerHelper('defend_form_getBonusTotal', function (value, options) {
    if(parseInt(value) > 0){
        return '+'+String(value);
    }else
    return String(value);
});