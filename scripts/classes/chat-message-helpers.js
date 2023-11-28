
class DF_CHECK_MESSAGE_HELPERS {
    static createModifiersString(bonusNames_ary, bonusValues_ary, numBonusesApplied_int)
    {
        //What mod text should look like
    //            <span class="tag tag_transparent">Constitution +2</span>
    //            <span class="tag tag_transparent">Expert +11</span>
    
        //Create Roll Modifyer Text
        let modString='';
        let valueString = '';
        for(let i=0; i<this.formData.numAppliedBonuses; i++)
        {
            valueString = '';
            if(bonusValues_ary[i]>=0){
                valueString = " +"+String(bonuesValues_ary[i])+" ";
            }else{
                valueString = " "+String(bonuesValues_ary[i])+" ";
            }
            modString = modString + '<span class="tag tag_transparent">'+String(bonusNames_ary[i])+valueString+'</span>';
        }
        return modString;
    }
    
    static createOutcomeString(offBy)
    {
        if(offBy > 9){
            //crit save (crit miss)
            outcomeString = '<p class="df-miss-by">Critial Save: <gm>+'+String(offBy)+'</gm></p>'
        }else if(offBy < -9){
            //crit hit (You gonna take dmg)
            outcomeString = '<p class="df-hit-by">Crittically Hit: <gm>'+String(offBy)+'</gm></p>'
    
        }else if(offBy >=0){
            //Miss
            outcomeString = '<p class="df-miss-by">Miss: <gm>+'+String(offBy)+'</gm></p>'
        }else{
            //Hit
            outcomeString = '<p class="df-hit-by">Hit: <gm>'+String(offBy)+'</gm></p>'
        }
    }
    
    static createHTMLstring(this.formData, rollFormula, dieResult, totalResult, modifiersString, outcomeString)
    {
        let part1 = `
            <div class="message-content">
                <span class="flavor-text">
                    <h4 class="action"><strong>Defence Saving Throw</strong></h4>
                    <div class="tags traits"></div>
                    <hr>
                    <div class="tags modifiers">
                        <span class="tag tag_transparent">${outcomeString}</span>
        `
        let part2 = `
            </div>
                </span>
                <div class="dice-roll saving-throw">
                    <div class="dice-result">
                        <div class="dice-formula">${rollFormula}</div>
                            <div class="dice-tooltip">
                                <section class="tooltip-part">
                                    <div class="dice">
                                        <header class="part-header flexrow">
                                            <span class="part-formula">1d20</span>
                                            <span class="part-total">${totalResult}</span>
                                        </header>
                                        <ol class="dice-rolls">
                                            <li class="roll die d20">${dieResult}</li>
                                        </ol>
                                    </div>
                                </section>
                            </div>
                            <h4 class="dice-total">23</h4>
                        </div>  
                    </div>
                </div>
            </div>
        `
    
        let completeHTML = part1 + modifiersString + part2;
        return completeHTML;
    }
}
