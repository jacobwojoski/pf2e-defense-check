/* ==================================================== */
/* =============== Handlebars Helpers ================= */
/* ==================================================== */

/**
 * renderActorSheet HOOK
 * 
 * Update the players sheet anytime its opened. 
 *      Add the button that opens the defense roll check popup.
 *      We need to add the button to the actor sheet every time its opened.
 * 
 * HOOK PARAMS
 * @app     UNUSED (App info I guess? Never used it so no idea what it does)
 * @html    The html DOM object that is going to be rendered.
 *              Were gonna add a new button in here.
 * @options Data passed with the hook. This holds all the data associated with the hook. 
 *              Used to see if were the owner of the actor + some extra info.
 */
Hooks.on('renderActorSheet', (app, html, options) => {
    console.log("RENDER ACTOR SHEET FINDING THE HTML");

    // Find the ac info on the player sheet, We want to place the button right below all the AC Info
    let acInfoSection = html.find(`[data-stat="ac"]`);

    let tooltip = "Roll A Defense(AC) Check against the targets Attack DC";
    let actorID = options.actor._id;
    let isOwner = options.owner;

    // Create the new elememt you want to insert, This will be a container for the button
    var newElement = document.createElement('div');

    // Create the HTML object for the new button we want to add
    let customRollDefenseButton = `<button type="button" data-action='${actorID}' value='${isOwner}' title='${tooltip}' id="defense_roll_check_module_btn" class="defense-button"><i class="defense-button-icon fas fa-dice-d20"></i></button>`;
    
    // Convert the button html to an actual object

    // Parse the Button HTML string
    var parser = new DOMParser();
    var parsedHtml = parser.parseFromString(customRollDefenseButton, 'text/html');

    // Get the first element from the parsed HTML
    var newElement = parsedHtml.body.firstChild;

    // Use insertAdjacentHTML to insert the new element after the end of the parent object rather theb appending it into the object
    acInfoSection[0].insertAdjacentHTML('afterend', newElement.outerHTML);

    // Create a callback for when the user clicks the button that we added. (Open the Defense check popup)
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
        }          
    }); // End click callback

});