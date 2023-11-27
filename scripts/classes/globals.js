class DEFFEND_CHECK_GLOBALS {
    
    static DEFNSE_CHECK_TEMPLATE = 'modules/pf2e-defense-check/templates/defendFormTemplate.hbs';

    static NUM_BONUS_TYPES_SIGNED = 14;
    static BONUS_TYPES_SIGNED = {
        ATTRIBUTE_POS:      0,
        PROFICENCY_POS:     1, 
        POTENCY_POS:        2,
        ITEM_POS:           3,
        STATUS_POS:         4,
        CIRCUMSTANCE_POS:   5,
        UNTYPED_POS:        6,
        ATTRIBUTE_NEG:      7,
        PROFICENCY_NEG:     8,
        POTENCY_NEG:        9,
        ITEM_NEG:           10,
        STATUS_NEG:         11,
        CIRCUMSTANCE_NEG:   12,
        UNTYPED_NEG:        13
    };

    static NUM_BONUS_TYPES = 7;
    static BONUS_TYPES = {
        ATTRIBUTE:      0,
        PROFICENCY:     1,
        POTENCY:        2,
        ITEM:           3,
        STATUS:         4,
        CIRCUMSTANCE:   5,
        UNTYPED:        6
    };

    static ROLL_TYPE = {
        PUBLIC: 0,
        GM:     1,
        BLIND:  2,
        SELF:   3
    };

    static BONUS_TYPE_TO_NAMES = ["Attribute","Proficency","Potency","Item","Status","Circumstance","Untyped"];
    static BONUS_TYPE_SIGNED_TO_NAMES = ["Attribute","Attribute","Proficency","Proficency","Potency","Potency","Item","Item","Status","Status","Circumstance","Circumstance","Untyped","Untyped"];

    /* Convert BONUS_TYPES to BONUS_TYPES_SIGNED */
    static get_signed_bonus_type(baseBonusType, isPos=true)
    {
        if(isPos){
            return parseInt(baseBonusType);
        }else{
            return parseInt(parseInt(baseBonusType)+parseInt(this.NUM_BONUS_TYPES));
        }
    }
}