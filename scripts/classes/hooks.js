/* ==================================================== */
/* =============== Handlebars Helpers ================= */
/* ==================================================== */

Hooks.once('init', () => {
    //DEFFENDER_FORM_OBJ = new DefendCheckForm();
})

Hooks.on('renderActorSheet', (app, html, options) => {
    console.log("RENDER ACTOR SHEET FINDING THE HTML");

    const deffenderbutton = html.find(`[class="shield-stats"]`);
    const btnPlacement = deffenderbutton.find('ol');
    let tooltip = "Roll A Defense(AC) Check against the targets Attack DC";
    let actorID = options.actor._id;
    let isOwner = options.owner;

    if(deffenderbutton.length)
    {
        let customRollDefenseButton = `<ol><button type="button" data-action='${actorID}' value='${isOwner}' title='${tooltip}' id="defense_roll_check_module_btn" class="defense-button"><i class="defense-button-icon fas fa-dice-d20"></i></button></ol>`;
        btnPlacement.append(
            customRollDefenseButton
        );

        html.on('click', `#defense_roll_check_module_btn`, (event)=> {
            console.log("ROLL DEFFEND BUTTON PRESSED!");
            
            // Check if were owner of selected actor or the GM
            let isOwner = false;
            if(game.user.isGM){
                isOwner=true
            }else if(event.currentTarget.attributes[2].value){
                isOwner=true;
            }

            if(isOwner){
                //We own the charcter so allow defense roll to occour
                DEFFENDER_FORM_OBJ = new DefendCheckForm(event.currentTarget.attributes[1].value).render(true);
                //DEFFENDER_FORM_OBJ.render(true);
            }          
        });
    }
});