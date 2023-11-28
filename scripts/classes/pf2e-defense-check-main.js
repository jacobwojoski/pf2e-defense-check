DEFFENDER_FORM_OBJ = null;

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
        bonusNames: []
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

        for (let i=0; i<DEFFEND_CHECK_GLOBALS.NUM_BONUS_TYPES_SIGNED; i++)
        {
            if(this.formData.playerBonuses_Ary[i].isBonusApplied){

                let tempBonusValue = this.formData.playerBonuses_Ary[i].getBonusValue();
                let tempBonusType = this.formData.playerBonuses_Ary[i].getSignedBonusType();

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
        rollFormula =   String(tempAtt)+'+'+
                        String(tempProf)+'+'+
                        String(tempPoten)+'+'+
                        String(tempItem)+'+'+
                        String(tempStatus)+'+'+
                        String(tempCirc)+'+'+
                        String(tempUntyped);

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
        //create and display message
        // This is untested and un verifed,
        // Want to make roll data that shows how much the player hit or missed by
            // TODO
            const customCSS = `
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
        `;

        // Inject the custom CSS into the document head
        const styleElement = document.createElement("style");
        styleElement.innerHTML = customCSS;
        document.head.appendChild(styleElement);

        // Define a roll formula and roll the dice
        const rollFormula = '1d20+'+String(this.formData.totalDefendBonus);
        const roll = await new Roll(rollFormula).roll();

        // Create a custom chat message with roll data
        const chatData = {
            content: `
            <div class="custom-miss">
                <p>This is a custom chat message with a roll:</p>
                <p>Roll Formula: ${rollFormula}</p>
                <p>Roll Result: ${roll.dice[0].total}<p>
                <p>Total: ${roll.total}</p>
                <p>/r 1d20</p>
                ${game.user.isGM ? '<p>GM Only: This sentence is visible only to the GM.</p>' : ''}
            </div>
            `,
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


