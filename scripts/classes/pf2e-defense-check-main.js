DEFFENDER_FORM_OBJ = null;

class DF_CHECK_MESSAGE_HELPERS {
    /**
     * The 4 Degrees od success that the result could have been
     */
    static DEGREE_SUCCESS = {
        CRIT_FAIL: 0,
        FAIL: 1,
        SUCCESS: 2,
        CRIT_SUCCESS: 3
    }

    /**
     * Create the HTML string that lists all the modifiers applied to our roll
     * @param {String[]} bonusNames_ary - Array of Bonus names that were applied to the result
     * @param {int[]} bonusValues_ary - Value of the bonuses that were applied to result
     * @param {int} numBonusesApplied_int - Number of bonuses that were applied
     * @returns {String} 
     */
    static createModifiersString(bonusNames_ary, bonusValues_ary, numBonusesApplied_int)
    {
        //What mod text should look like
        //<span class="tag tag_transparent">Constitution +2</span>
        //<span class="tag tag_transparent">Expert +11</span>
        //<span class="tag tag_transparent">Fatigued -2</span>
    
        //Create Roll Modifyer Text
        let modString='';
        let valueString = '';
        for(let i=0; i<numBonusesApplied_int; i++)
        {
            valueString = '';
            if(bonusValues_ary[i]>=0){
                valueString = " +"+String(bonusValues_ary[i])+" ";
            }else{
                valueString = " "+String(bonusValues_ary[i])+" ";
            }
            modString = modString + '<span class="tag tag_transparent">'+String(bonusNames_ary[i])+valueString+'</span>';
        }
        return modString;
    }
    
    /**
     * Create a string for the chat message that explains the result we got
     * @param {int} offBy - How much we hit or missed by
     * @returns 
     */
    static createOutcomeString(offBy)
    {
        //offBy = (check - DC)
        // neg offby = Check Bigger
        let outcomeString = '';
        if(offBy > 9){
            //Target Crit Missed You
            outcomeString = '<p class="df-hit-by">They <b>Crittically Missed</b> You: +'+String(offBy)+'</p>';
        }else if(offBy < -9){
            //Target Crit Hit You
            outcomeString = '<p class="df-miss-by">They <b>Critialy Hit</b> You: '+String(offBy)+'</p>';
        }else if(offBy >=0){
            //Target Missed You
            outcomeString = '<p class="df-hit-by">They Missed You: +'+String(offBy)+'</p>';
        }else{
            //Target Hit You
            outcomeString = '<p class="df-miss-by">They Hit You: '+String(offBy)+'</p>';
        }
        return outcomeString;
    }
    
    /**
     * Get the degree of success given the die value and how much we missed by
     * Crits Count as + 10 and - 10 or if We roll a 1 or 20
     * @param {int} offBy - How much we missed or hit by
     * @param {int} dieRoll - Value on the Die
     * @returns {DEGREE_SUCCESS} - CF,F,S,CS
     */
    static getDegreeSuccess(offBy, dieRoll)
    {
        if(offBy > 9 || dieRoll == 20){
            //crit save (crit miss)
            return this.DEGREE_SUCCESS.CRIT_SUCCESS;
        }else if(offBy < -9 || dieRoll == 1){
            //crit hit (You gonna take dmg)
           return this.DEGREE_SUCCESS.CRIT_FAIL;
        }else if(offBy >=0){
            //Miss
           return this.DEGREE_SUCCESS.SUCCESS;
        }else{
            //MHit
            return this.DEGREE_SUCCESS.FAIL;
        }
    }

    /**
     * Create the HTML String thats the layout for the chat message
     * NOTE: Message uses PF2E Specific CSS
     * @param {String} rollFormula - Formula that needs to be in chat msg obj (1d20+X)
     * @param {int} dieResult - Result of the Die roll, Value between 1 & 20
     * @param {int} totalResult - Result of the Die Roll + Mod
     * @param {String} modifiersString 
     * @param {String} outcomeString - HTML String stating outcome of roll "Critical miss by -15"
     * @param {int} dc - DC of the monster's attack (Value we want to beat) this is 0 if the user didn't input anything
     * @param {DEGREE_SUCCESS} degSuc - Degree of success, CF,F,S,CS
     * @returns 
     */
    static createHTMLstring(rollFormula, dieResult, totalResult, modifiersString, outcomeString,dc,degSuc)
    {
        let rollDieMaxMin = '';
        let diceTotalSuccessFail = '';
        
        // max and success : add green if rolled a 20 or Crit Due to +10
        // min and failure : add red if rolled a 1 or Crit failed to -10
        // Only add color if player input a DC! 
        if(dc !=0 ){
            if(degSuc == this.DEGREE_SUCCESS.CRIT_FAIL){
                rollDieMaxMin= 'min ';
                diceTotalSuccessFail='failure ';
            }else if(degSuc == this.DEGREE_SUCCESS.CRIT_SUCCESS){
                rollDieMaxMin= 'max ';
                diceTotalSuccessFail='success ';
            }
        }

        let part1 = `
            <div class="message-content">
                <span class="flavor-text">
                    <h4 class="action"><strong>Defence Saving Throw</strong></h4>
                    <div class="tags traits"></div>
                    <hr>
                    <div class="tags modifiers">
        `
        // part 2 is the mod string created somewhere else

        let part3 = `
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
                                            <li class="roll die d20 ${rollDieMaxMin}">${dieResult}</li>
                                        </ol>
                                    </div>
                                </section>
                            </div>
                            <h4 class="dice-total ${diceTotalSuccessFail}">${totalResult}</h4>
                            <hr>
                            <div>
                                <p class="dc_center">Targets Attack DC: ${dc}</p>
                            </div>
                            <div>
                                ${outcomeString}
                            </div>
                            <hr>
                        </div>  
                    </div>
                </div>
            </div>
        `
        
        let completeHTML = part1 + modifiersString + part3;
        return completeHTML;
    }
}

// Class that holds all modifier info. 
class CustomBonusClass {
    BonusName =         "";     /* STRING */
    BonusType =         0;      /* BONUS_TYPES */
    BonusTypeSigned =   0;      /* BONUS_TYPE_SIGNED */
    BonusValue =        0;      /* INT */
    isPos = true;
    
    constructor(signedBonusTypeEnum){
        this.BonusTypeSigned = parseInt(signedBonusTypeEnum);
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
    BonusType=          0;
    BonusTypeSigned=    0;
    isPos =             true;
    DefaultBonus =      {};
    OverrideBonus =     {};
    isBonusOverridden = false;
    isBonusApplied =    false;

    constructor(signedBonusTypeEnum){
        this.BonusTypeSigned    = signedBonusTypeEnum;
        this.DefaultBonus       = new CustomBonusClass(signedBonusTypeEnum);
        this.OverrideBonus      = new CustomBonusClass(signedBonusTypeEnum);
        this.isPos              = DEFFEND_CHECK_GLOBALS.get_is_pos(signedBonusTypeEnum);
        this.BonusType          = DEFFEND_CHECK_GLOBALS.get_base_bonus_type(signedBonusTypeEnum);
        this.isBonusOverridden  = false;
        this.isBonusApplied     = false;
    }

    /* Get the current value bing used */
    getBonusValue(){
        if(this.isBonusOverridden){
            return this.OverrideBonus.BonusValue;
        }else{
            return this.DefaultBonus.BonusValue;
        }
    }

    /* Return Mod TYPE enum [CIR, STATUS, UNTYPED, ....] */
    getBonusType(){
        return this.BonusType;
    }

    /* Return Signed Mod Type enum [POS_CIR, NEG_CIR, POS_UNTYPES....] */
    getSignedBonusType(){
        return this.BonusTypeSigned
    }

    getBonusName(){
        if(this.isBonusOverridden){
            return this.OverrideBonus.BonusName;
        }else{
            return this.DefaultBonus.BonusName;
        }
    }
}

// Main displau form. This form needs to retriev the data, calc, Allow adjustments from user
// and display all the info

class DefendCheckForm extends FormApplication {
    formData = {
        actorID: "",                  /* STRING */
        playerBonuses_Ary:  [14],     /* [CustomPlayerBonus] */
        isBonusApplied_Ary: [14],     /* [Boolian] */
        targetsAttackDC:    0,        /* INT */
        overrideInputValues: {
            bonusName:  "", /* STRING */
            bonusType:  5,  /* BONUS_TYPES (DEFAULT: CIRCUMSTANCE)*/
            bonusTypeSigned: 5, /* BONUS_TYPES_SIGNED (DEFAULT: CIRCUMSTANCE_POS) */
            bonusValue: 0,  /* INT */
            isNeg: false,   /* BOOL */
        },
        totalDefendBonus: 0, /* INT */
        rollType: 0,         /* ROLL TYPE */
        rollFormula: '',
        numAppliedBonuses: 0,
        appliedBonusNames: [14],
        appliedBonusValues: [14]
    };

    constructor(passedInActorID){
        super();
        this.formData.actorID = passedInActorID;

        for(let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++){
            this.formData.playerBonuses_Ary[i] = new CustomPlayerBonus(i);
            this.formData.isBonusApplied_Ary[i] = false;
        }
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            popOut: true,
            resizable: true,
            hight: 'auto',
            template: DEFFEND_CHECK_GLOBALS.DEFNSE_CHECK_TEMPLATE,
            id: 'defend-form-id',
            title: 'Defend Form',
        });
    }

    /**
     * This funtion 
     * - parse the actor you selected to find current AC Modifiers
     * - update the defaultPlayerBonus with those modifiers
     * @returns void
     */
    parsePlayerData(){
        const character = game.actors.get(this.formData.actorID);
        if(!character) {
            return;
        }

        /* Reset isApplied to false */
        this.formData.isBonusApplied_Ary.fill(false);
        for(let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++){
            this.formData.playerBonuses_Ary[i].isBonusApplied = false;
        }

        /* isBonusApplied if an Override Is present 
            (These get removed on init so means it must have been added by player) 
        */
        for(let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++){
            if(this.formData.playerBonuses_Ary[i].OverrideBonus.BonusValue != 0){
                this.formData.playerBonuses_Ary[i].isBonusApplied = true;
                this.formData.isBonusApplied_Ary[i] = true;
            }
        }

        /* loop through all currently applied modifiers to the players AC and save them */
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
                            newBonus.BonusTypeSigned = DEFFEND_CHECK_GLOBALS.BONUS_TYPES_SIGNED.CIRCUMSTANCE_NEG;
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
                } //End Bonus Tyoe Switch Case\

                //Make sure its a int
                newBonus.BonusTypeSigned = parseInt(newBonus.BonusTypeSigned);

                //We found an active bonus, update isBonusApplied
                this.formData.isBonusApplied_Ary[newBonus.BonusTypeSigned] = true;
                this.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].isBonusApplied = true

                //Update Currently stored bonus if new value for associated bonus type are larger than currently saved value
                let currentVal = this.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusValue;
                if(newBonus.isPos && newBonus.BonusValue > currentVal){
                    //If new pos value is > current pos value
                    //Object.assign(DefendCheckForm.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus, newBonus);
                    this.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusValue = newBonus.BonusValue;
                    this.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusName = newBonus.BonusName;

                }else if(!newBonus.isPos && newBonus.BonusValue < currentVal){
                    //If new Neg value is < current neg value
                    this.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusValue = newBonus.BonusValue;
                    this.formData.playerBonuses_Ary[newBonus.BonusTypeSigned].DefaultBonus.BonusName = newBonus.BonusName;
                }

            } //End if(enabled)
        } //End Modifiers for loop
    }

    updateRollTotal(){
        let tempAtt=0;
        let tempProf=0;
        let tempPoten=0;
        let tempItem=0;
        let tempStatus=0;
        let tempCirc=0;
        let tempUntyped=0;

        this.formData.numAppliedBonuses = 0;
        this.formData.appliedBonusNames.fill('');
        this.formData.appliedBonusValues.fill(0);
        

        // catagorize each bonus
        for (let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++)
        {
            if(this.formData.playerBonuses_Ary[i].isBonusApplied){

                let tempBonusValue = this.formData.playerBonuses_Ary[i].getBonusValue();
                let tempBonusType = this.formData.playerBonuses_Ary[i].getSignedBonusType();
                let tempBonusName = this.formData.playerBonuses_Ary[i].getBonusName();

                this.formData.appliedBonusNames[this.formData.numAppliedBonuses]=   tempBonusName;
                this.formData.appliedBonusValues[this.formData.numAppliedBonuses]=  tempBonusValue;
                this.formData.numAppliedBonuses++;

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

        /* Calc total bonus */
        let calcDefendBonus = tempAtt+tempProf+tempPoten+tempItem+tempStatus+tempCirc+tempUntyped;
        this.formData.totalDefendBonus = calcDefendBonus;
    }

    getData(){
        this.parsePlayerData();
        this.updateRollTotal();
        //Update Everything When form gets rendered or refreshed. 
        //All Updates will happen here
        const clone = JSON.parse(JSON.stringify(this.formData));
        return clone;
    }

    // ==============================================
    // ========= OVERRIDE INPUT STUFF ===============
    // ==============================================

    //update the signedBonusType value for overrideInputValues object
    _updateSignedBonusType(){
        let curBaseBonusType = this.formData.overrideInputValues.bonusType;
        let curIsPos = this.formData.overrideInputValues.isPos;
        this.formData.overrideInputValues.bonusTypeSigned = 
            DEFFEND_CHECK_GLOBALS.get_signed_bonus_type(curBaseBonusType,curIsPos);
    }

    //Handle any selections on any of the override checkbox's
    async _handleOverrideCheckbox(event){
        let plyrData = this.formData;
        let modifierType = parseInt(event.target.value);
        let plyrBonusData = plyrData.playerBonuses_Ary[modifierType];
        let curIsOverwridden = plyrBonusData.isBonusOverridden;

        //Verify turning on override
        if(curIsOverwridden == false && plyrBonusData.OverrideBonus.BonusValue != 0){
            //Set Use override to ON
            this.formData.playerBonuses_Ary[modifierType].isBonusOverridden = true;
        }else if(curIsOverwridden == true){
            //turn off override
            this.formData.playerBonuses_Ary[modifierType].isBonusOverridden = false;
        }else{
            //Display Warning if trying to enable an override with no data
            let warnString = "No Override Value saved";
            ui.notifications.warn(warnString);
        }

        //Refresh Screen to display new info
        //DEFFENDER_FORM_OBJ.render();
        //DEFFENDER_FORM_OBJ.activateListeners(this.element);
        this.render()
    }

    //Handle Text input for Override Bonus Text Field
    async _handleNewOverrideBonusTypeText(event){
        //Save Text to Data Model
        const newBonusDescription = event.target.value;
        this.formData.overrideInputValues.bonusName = newBonusDescription;
    }

    //Handle Bonus Type dropdown selection in the "Create new override" inputs
    async _handleNewOverrideBonusTypeDropdown(event){
        const newBonusType = event.target.value;
        this.formData.overrideInputValues.bonusType = newBonusType;
        this._updateSignedBonusType();
    }

    //Handle number value bing input into the override bonus type boxes
    async _handleNewOverrideBonusTypeValueInput(event){
        //Save value to Data Model. Dont Change data model.
        const newBonusValue = parseInt(event.target.value);
        this.formData.overrideInputValues.bonusValue = newBonusValue;
        if(newBonusValue >= 0){
            this.formData.overrideInputValues.isPos = true;
        }else{
            this.formData.overrideInputValues.isPos = false;
        }
        this._updateSignedBonusType();
    }

    //Handle *Add* button to add new override value
    async _handleNewOverrideBonusTypeConfirmButton(event){
        //Confirm New override if replacing an existing Override value
            //TODO

        //--- Save New bonus to data model ---
        //Get stored override objects & objects to update
        let toOverrideObj = this.formData.overrideInputValues;
        let signedModifier = toOverrideObj.bonusTypeSigned;
        
        //Update player bonus data
        this.formData.playerBonuses_Ary[signedModifier].isBonusOverridden = true;
        this.formData.playerBonuses_Ary[signedModifier].isPos = toOverrideObj.isPos;

        //update override object
        this.formData.playerBonuses_Ary[signedModifier].OverrideBonus.BonusName = toOverrideObj.bonusName;
        this.formData.playerBonuses_Ary[signedModifier].OverrideBonus.BonusValue = toOverrideObj.bonusValue;
        this.formData.playerBonuses_Ary[signedModifier].OverrideBonus.isPos = !toOverrideObj.isNeg;

        //Update isBonusApplied_Ary incase we added an initally unused bonus
        this.formData.playerBonuses_Ary[signedModifier].isBonusApplied = true;
        this.formData.isBonusApplied_Ary[signedModifier] = true;
        

        //Reset currently saved data in override data store
        this.formData.overrideInputValues.bonusName = "";
        this.formData.overrideInputValues.bonusValue = 5;
        this.formData.overrideInputValues.bonusTypeSigned = 5;
        this.formData.overrideInputValues.isPos = true;

        //Rerender to display override
        //DEFFENDER_FORM_OBJ.render();
        //DEFFENDER_FORM_OBJ.activateListeners(this.element);
        this.render();
    }

    // ============ END OVERRIDE INPUTS =================

    // ==================================================
    // ================ ATTACK DC INPUTS ================
    // ==================================================
    async _handleDefenceCheckDCInput(event){
        const targetsAttackDCValue = event.target.value;
        this.formData.targetsAttackDC = targetsAttackDCValue;
    }

    async _getDCfromGM(event){
         //ASK GM for check value?
            //TODO
                //set bool notRec
                //Socket -> request GM VALUE
                //GM update value
                //GM Socket -> back
                // update bool Var Rec
                // get var from flag
                // use var for DC
    }

    // ==================================================
    // ================== ROLL SELECTIONS ===============
    // ==================================================

    async _handleRollTypedropdown(event){
        const newRollType = event.target.value;
        this.formData.rollType = newRollType;
    }

    async _handleRollButton(event){
            //background-color: green;
            const customCSS = `
            .df-hit-by {
                text-align: center;
                color: green;
            }
            .df-miss-by {
                text-align: center;
                color: red;
            }
            .df-crit-save-die {
                background-color: #ffcc00;
            }
            .df-crit-fail-die {
                background-color: #ffcc00;
            }
            .custom-hit-by {
                background-color: #ffcc00;
                border: 2px solid #ff9900;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            .custom-miss {
                background-color: #ffcc00;
                border: 2px solid #ff9900;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            .custom-modifier {
                background-color: grey;
                font-size: 5px;
                border-size: 2px;
            }
            .dc_center {
                text-align: center;
            }
        `;

        // Inject the custom CSS into the document head
        const styleElement = document.createElement("style");
        styleElement.innerHTML = customCSS;
        document.head.appendChild(styleElement);

        // Define a roll formula and roll the dice
        const rollFormula = '1d20+'+String(this.formData.totalDefendBonus);
        const roll = await new Roll(rollFormula).roll();

        //Create HTML for chat message
        let modifiersString = DF_CHECK_MESSAGE_HELPERS.createModifiersString(this.formData.appliedBonusNames, this.formData.appliedBonusValues, this.formData.numAppliedBonuses);

        let offBy = roll.total - this.formData.targetsAttackDC;        
        let outcomeString = DF_CHECK_MESSAGE_HELPERS.createOutcomeString(offBy);
        let degSuccess = DF_CHECK_MESSAGE_HELPERS.getDegreeSuccess(offBy, roll.dice[0].total);

        let HTMLstring = DF_CHECK_MESSAGE_HELPERS.createHTMLstring(rollFormula, roll.dice[0].total, 
                                                                    roll.total, modifiersString, 
                                                                    outcomeString, this.formData.targetsAttackDC, 
                                                                    degSuccess);

        /* Roll Types
            let isBlind = false;
            let isBlindGM = false;
            let isSelfRoll = false;
            let isPrivateGM = false;
        */
            //TODO: MAKE THIS WORK
        let isBlindRoll = false;
        switch(this.rollType){
            case DEFFEND_CHECK_GLOBALS.ROLL_TYPES.BLIND_GM_ROLL:
            case DEFFEND_CHECK_GLOBALS.ROLL_TYPES.PRIVATE_GM_ROLL:
                isBlindRoll=true;
            break;
            default:
        }

        // Create a custom chat message with roll data
        const chatData = {
            content: HTMLstring,
            blind: isBlindRoll,
            speaker: ChatMessage.getSpeaker({ actor: game.user.character }),
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: roll,
        };

        // Send the custom chat message to the chat log
        ChatMessage.create(chatData, {});
    }
    
    activateListeners(html) {
        super.activateListeners(html);

        //data-action="d2checkbox"
        // "[data-action]"
        // "[df-chkbx-action]"

        //Checkbox on selections
        html.on('click',    "#df-mod-use-override-checkbox", this._handleOverrideCheckbox.bind(this));    //Override Checkbox (Use override value)
    
        //override inputs "#df-mod-override-descrip-text-input"
        html.on('input',    "#df-mod-override-descrip-text-input",  this._handleNewOverrideBonusTypeText.bind(this));          //Input Text (Name of bonus)
        html.on('change',   "#df-mod-override-bonus-type-dropdown", this._handleNewOverrideBonusTypeDropdown.bind(this));      //Selection input (Drop down)
        html.on('input',    "#df-mod-override-value-num-input",     this._handleNewOverrideBonusTypeValueInput.bind(this));    //Input number (New Bonus Value)
        html.on('click',    "#df-mod-override-confirm-button",      this._handleNewOverrideBonusTypeConfirmButton.bind(this)); //Add value (Confirmation input)

        //Attack DC inputs
        html.on('input',    "#df-mod-defence-check-dc-input", this._handleDefenceCheckDCInput.bind(this));

        //Roll inputs
        html.on('change',   "#df-mod-roll-type-dropdown",    this._handleRollTypedropdown.bind(this));
        html.on('click',    "#df-mod-roll-button",           this._handleRollButton.bind(this));
    }

    /*
    async _updateObject(event, formData){
        console.log(DefendCheckForm.formData);
    }*/
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


