DEFFENDER_FORM_OBJ = null;

// Class that holds all modifier info. 
class CustomBonusClass {
    BonusName =         "";     /* STRING */
    BonusType =         0;      /* BONUS_TYPES */
    BonusTypeSigned =   0;      /* BONUS_TYPE_SIGNED */
    BonusValue =        0;      /* INT */
    isPos = true;
    
    constructor(signedBonusTypeEnum){
        this.BonusTypeSigned = signedBonusTypeEnum;
        if(signedBonusTypeEnum >= DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES){
            this.isPos = false;
            this.BonusType = signedBonusTypeEnum-DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES;
        }else{
            this.isPos = true;
            this.BonusType = signedBonusTypeEnum;
        }
        
    }
}

// Class that holds 2 modifers. Hold the base and the override value
class CustomPlayerBonus {
    BonusType=0;
    DefaultBonus =  {};
    OverrideBonus =  {};
    isBonusOverridden = false;
    constructor(signedBonusTypeEnum){
        this.BonusType = signedBonusTypeEnum;
        this.DefaultBonus = new CustomBonusClass(signedBonusTypeEnum);
        this.OverrideBonus = new CustomBonusClass(signedBonusTypeEnum);
    }

    getBonusValue(){
        return this.signedBonusTypeEnum;
    }

    getBonusType(){
        //Bonus type should be the same between both subclasses
        if(this.isBonusOverridden)
        {
            return this.DefaultBonus.BonusType;
        }else{
            return this.OverrideBonus.BonusType;
        }
    }
}

// Main displau form. This form needs to retriev the data, calc, Allow adjustments from user
// and display all the info

class DefendCheckForm extends FormApplication {
    static formData = {
        actorID: "",                  /* STRING */
        playerBonuses_Ary:  [14],     /* [CustomPlayerBonus] */
        isBonusApplied_Ary: [14],     /* [Boolian] */
        targetsAttackDC:    0,        /* INT */
        overrideInputValues: {
            bonusName:  "", /* STRING */
            bonusType:  0,  /* BONUS_TYPES */
            bonusValue: 0,  /* INT */
            isNeg: false,   /* BOOL */
        },
        totalDefendBonus: 0, /* INT */
        rollType: 0,         /* ROLL TYPE */
    };

    constructor(passedInActorID){
        super();
        DefendCheckForm.formData.actorID = passedInActorID;

        for(let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++){
            DefendCheckForm.formData.playerBonuses_Ary[i] = new CustomPlayerBonus(i);
            DefendCheckForm.formData.isBonusApplied_Ary[i] = false;
        }
        
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            popOut: true,
            template: DEFFEND_CHECK_GLOBALS.DEFNSE_CHECK_TEMPLATE,
            id: 'deffend-form-id',
            title: 'Deffend Form',
        });
    }

    /**
     * This funtion 
     * - parse the actor you selected to find current AC Modifiers
     * - update the defaultPlayerBonus with those modifiers
     * @returns void
     */
    static parsePlayerData(){
        const character = game.actors.get(DefendCheckForm.formData.actorID);
        if(!character) {
            return;
        }

        DefendCheckForm.formData.isBonusApplied_Ary.fill(false);
        for(let it of character.attributes.ac.modifiers)
        {
            if( it.enabled )
            {
                let type = it.type;
                let newBonus = new CustomBonusClass(0);
                newBonus.BonusValue = it.modifier;
                newBonus.isPos = ((newBonus.BonusValue > 0) ? true : false);
                newBonus.BonusName = it.label;

                switch (type){
                    case 'ability':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.ATTRIBUTE;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ATTRIBUTE_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ATTRIBUTE_NEG;
                        }
                        break;
                    case 'proficiency':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.PROFICENCY;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.PROFICENCY_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.PROFICENCY_NEG;
                        }
                        break;
                    case 'potency':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.POTENCY;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.POTENCY_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.POTENCY_NEG;
                        }
                    case 'item':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.ITEM;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ITEM_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ITEM_NEG;
                        }
                        break;
                    case 'status':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.STATUS;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.STATUS_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.STATUS_NEG;
                        }
                        break;
                    case 'circumstance':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.CIRCUMSTANCE;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.CIRCUMSTANCE_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.CIRCUMSTANCE_POS;
                        }
                        break;
                    case 'untyped':
                        newBonus.BonusType = DEFFEND_CHECK_GLOBALS.BONUS_TYPES.UNTYPED;
                        if(newBonus.isPos){
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.UNTYPED_POS;
                        }else{
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.UNTYPED_NEG;
                        }
                        break;
                } //End Bonus Tyoe Switch Case

                //We found an active bonus
                DefendCheckForm.formData.isBonusApplied_Ary[newBonus.BonusTypeSigned] = true;

                //Update Currently stored bonus if new value for associated bonus type are larger than currently saved value
                let currentVal = DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusValue;
                if(newBonus.isPos && newBonus.BonusValue > currentVal){
                    //If new pos value is > current pos value
                    //Object.assign(DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus, newBonus);
                    DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusValue = newBonus.BonusValue;
                    DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusName = newBonus.BonusName;

                }else if(!newBonus.isPos && newBonus.BonusValue < currentVal){
                    //If new Neg value is < current neg value
                    DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusValue = newBonus.BonusValue;
                    DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusName = newBonus.BonusName;
                }

            } //End if(enabled)
        } //End Modifiers for loop
    }

    static updateRollTotal(){
        let tempAtt=0;
        let tempProf=0;
        let tempPoten=0;
        let tempItem=0;
        let tempStatus=0;
        let tempCirc=0;
        let tempUntyped=0;

        for (let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++)
        {
            if(DefendCheckForm.formData.isBonusApplied_Ary[i]){

                let tempBonusValue = DefendCheckForm.formData.playerBonuses_Ary[i].getBonusValue();
                let tempBonusType = DefendCheckForm.formData.playerBonuses_Ary[i].getBonusType();

                switch(tempBonusType){
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ATTRIBUTE_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ATTRIBUTE_NEG:
                        tempAtt += tempBonusValue;
                        break;
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.PROFICENCY_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.PROFICENCY_NEG:
                        tempProf += tempBonusValue;
                        break;
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.POTENCY_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.POTENCY_NEG:
                        tempPoten += tempBonusValue;
                        break;
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ITEM_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.ITEM_NEG:
                        tempItem += tempBonusValue;
                        break;
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.STATUS_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.STATUS_NEG:
                        tempStatus += tempBonusValue;
                        break;
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.CIRCUMSTANCE_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.CIRCUMSTANCE_NEG:
                        tempCirc += tempBonusValue;
                        break;
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.UNTYPED_POS:
                    case DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.UNTYPED_NEG:
                        tempUntyped += tempBonusValue;
                        break;
                }
            }
        }

        let calcDefendBonus = tempAtt+tempProf+tempPoten+tempItem+tempStatus+tempCirc+tempUntyped;

        DefendCheckForm.formData.totalDefendBonus = calcDefendBonus;
    }

    getData(){
        DefendCheckForm.parsePlayerData();
        DefendCheckForm.updateRollTotal();
        //Update Everything When form gets rendered or refreshed. 
        //All Updates will happen here
        return DefendCheckForm.formData;
    }

    createRollMessage(){
        //
    }

    // ==============================================
    // ========= OVERRIDE INPUT STUFF ===============
    // ==============================================

    //Handle any selections on any of the override checkbox's
    async _handleOverrideCheckbox(event){
        let plyrData = DefendCheckForm.formData;
        let modifierType = event.id.value;

        let plyrBonusData = plyrData.playerBonuses_Ary[modifierType];
        
        //Check if there is an override Value
        if(plyrBonusData.OverrideBonus.BonusValue != 0){
            //Set Use override to ON
            plyrBonusData.isBonusOverridden = true;

        }else{
            //Display Warning if NO OVERRIDE
            let warnString = "No Override Value saved";
        }

        //Refresh Screen to display new info
        DEFFENDER_FORM_OBJ.render(true);
    }

    //Handle Text input for Override Bonus Text Field
    async _handleNewOverrideBonusTypeText(event){
        //Save Text to Data Model
        const newBonusDescription = event.target.value;
        DefendCheckForm.formData.overrideInputValues.bonusName = newBonusDescription;
    }

    //Handle Bonus Type dropdown selection in the "Create new override" inputs
    async _handleNewOverrideBonusTypeDropdown(event){
        const newBonusType = event.target.value;
        DefendCheckForm.formData.overrideInputValues.bonusType = newBonusType;
    }

    //Handle number value bing input into the override bonus type boxes
    async _handleNewOverrideBonusTypeValueInput(event){
        //Save value to Data Model. Dont Change data model.
        const newBonusType = event.target.value;
        DefendCheckForm.formData.overrideInputValues.bonusValue = newBonusType;
        if(newBonusType<0){
            DefendCheckForm.formData.overrideInputValues.isNeg = true;
        }else{
            DefendCheckForm.formData.overrideInputValues.isNeg = false;
        }
    }

    //Handle *Add* button to add new override value
    async _handleNewOverrideBonusTypeConfirmButton(event){
        //Confirm New override if replacing an existing Override value
        //Save New bonus to data model
        let plyrData = DefendCheckForm.formData;
        let modifierType = event.id.value;
        let plyrBonusData = plyrData.playerBonuses_Ary[modifierType];
        
        let overrideObj = DefendCheckForm.formData.overrideInputValues;
        plyrBonusData.BonusName = overrideObj.bonusName;
        plyrBonusData.BonusValue = overrideObj.bonusValue;
        plyrBonusData.isPos = !overrideObj.isNeg;

        //Reset currently saved data in override data store
        overrideObj.bonusName = "";
        overrideObj.bonusValue = 0;
        overrideObj.isNeg = false;

        //Rerender
        DEFFENDER_FORM_OBJ.render(true);
    }

    // ============ END OVERRIDE INPUTS =================

    // ==================================================
    // ================ ATTACK DC INPUTS ================
    // ==================================================
    async _handleDefenceCheckDCInput(event){
        const targetsAttackDCValue = event.target.value;
        DefendCheckForm.formData.targetsAttackDC = targetsAttackDCValue;
    }

    // ==================================================
    // ================== ROLL SELECTIONS ===============
    // ==================================================
    async _handleRollTypedropdown(Event){
        
    }

    async _handleRollButton(){
        //ASK GM FOR CHECK VALUE SOMEHOW?
    }
    
    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', "df-mod-use-override-checkbox", this._handleButtonClick);//Override Checkbox (Use override value)

        html.on('input', "#df-mod-override-descrip-text-input", this._handleNewOverrideBonusTypeText);    //Input Text (Name of bonus)
        html.on('change', "#df-mod-override-bonus-type-dropdown", this._handleNewOverrideBonusTypeDropdown);  //Selection input (Drop down)
        html.on('input', "#df-mod-override-value-num-input", this._handleNewOverrideBonusTypeValueInput);  //Input number (Bonus number)
        html.on('click', "#df-mod-override-confirm-button", this._handleNewOverrideBonusTypeConfirmButton);  //Add value (Confirmation input)

        html.on('input', "#df-mod-defence-check-dc-input", this._handleDefenceCheckDCInput);
    }

    async _updateObject(event, formData){
        console.log(DefendCheckForm.formData);
    }
}


/**
 * - Hook to add deffend button to chat window on spell attacks?
 * - Use button in defend reaction by using </scripts> field to call Mod stuff can use same button ID?
 * - 
 * - MAP Penalty Selector
 * - Melee Attack, Ranged Attack, Spell Attack Selector
 * - Range Modifier for ranged attacks
 * -  //*TODO* ON CLOSE OR ROLL CLEAR ALL SAVED DATA
 * -  //*TODO* move isBonusApplied_Ary inside playerBonusAry onjects
 */


