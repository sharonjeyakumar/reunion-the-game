const ostmainMenu = "ost/mainmenu.wav";
const mainMenuTheme = new Audio(ostmainMenu);

const fxclickSound = "ost/shutter-click.wav";
const clickSound = new Audio(fxclickSound);

const fxchoiceSound = "ost/choicesound.mp3";
const choiceSound = new Audio(fxchoiceSound);

const fxchoiceConfirm = "ost/choiceconfirm2.mp3";
const choiceConfirm = new Audio(fxchoiceConfirm);



let audioUnlocked = false;
function unlockAndPlayFirstClick() {
  if (!audioUnlocked) {
    audioUnlocked = true;

    // Preload all sounds
    [mainMenuTheme, clickSound, choiceSound, choiceConfirm].forEach(snd => {
      snd.load();
    });

    // Play click sound first, then theme
    clickSound.currentTime = 0;
    clickSound.play()
      .then(() => {
        setTimeout(() => {
          mainMenuTheme.currentTime = 0;
          mainMenuTheme.play().catch(err => {
            console.warn("Theme failed:", err);
          });
        }, 150); // delay so they don't overlap abruptly
      })
      .catch(err => {
        console.warn("Click sound failed:", err);
      });

  } else {
    playSound(clickSound);
  }
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(err => {
    console.warn("Sound play failed:", err);
  });
}


let titleShown = false;
let isGameScreen = false;

document.body.addEventListener('click', function(e) {
    const effect = document.createElement('div');
    effect.classList.add('click-effect');
    effect.style.left = e.pageX + 'px';
    effect.style.top = e.pageY + 'px';

    // Create dot
    const dot = document.createElement('div');
    dot.classList.add('dot');
    effect.appendChild(dot);

    // Create ring
    const ring = document.createElement('div');
    ring.classList.add('ring');
    effect.appendChild(ring);

    document.body.appendChild(effect);

    // Remove effect after animation ends
    ring.addEventListener('animationend', () => {
      effect.remove();
    });
  });

const app = document.getElementById('app');

const titleContainer = document.querySelector('.title');
const creditsContainer = document.querySelector('.credits');
const backBtn = document.getElementById('backBtn');

app.addEventListener('click', () => {
  if (!isGameScreen) {
    if (!titleShown) {
      unlockAndPlayFirstClick(); // plays clickSound immediately

  // Play main menu theme slightly later so it doesn't clash with the click
//   setTimeout(() => {
//     mainMenuTheme.currentTime = 0;
//     // mainMenuTheme.play().catch(err => console.warn("Main menu theme failed:", err));
//   }, 150);

      titleContainer.classList.add('show');
      creditsContainer.classList.add('show');
      titleShown = true;
    } else {
      playSound(clickSound); // later clicks
      isGameScreen = true;
      mainMenuTheme.pause();
      mainMenuTheme.currentTime = 0;

      app.style.transition = 'opacity 0.2s ease';
      app.style.opacity = '0';
      setTimeout(() => {
        app.style.backgroundImage = 'none';
        app.style.opacity = '1';
      }, 300);

      mainMenu.style.opacity = 0;
      setTimeout(() => {
        mainMenu.style.display = 'none';
        gameScreen.style.display = 'block';
      }, 500);
      setTimeout(() => {
        addDialogue();
        // backBtn.classList.add('show');
      }, 550);
    }
  }
});


//Mainmenu 
const mainMenu = document.getElementById('mainMenu');
const playBtn = document.getElementById('playBtn');


//Game Scene
const gameScreen = document.getElementById('gameScreen');

let currentScene = "intro";
let currentDialogue = 0;
let dialogue = [];
let choicesShown = false;
let suppressClickSound = false;

function renderScene(){
    const scene = scenes[currentScene];
    currentDialogue = 0;
    dialogue = scene.text;
    choicesShown = false;
}

let currentMusic = null;
function musicHandler(ost){
    if(!ost) return;

    if(currentMusic){
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    currentMusic = new Audio(`ost/${ost}`);
    currentMusic.currentTime = 0;
    currentMusic.play().catch(err => {
        console.warn(`Music "${ost}" failed to play:`, err);
    })
}

function addDialogue(){
    if(currentDialogue <= dialogue.length-1){
        const line = dialogue[currentDialogue];
        const dialogueContainer = document.createElement('div');
        dialogueContainer.classList.add('dialogueContainer');

        const element = document.createElement('h2');
        element.textContent = line.text;
        dialogueContainer.appendChild(element);
        element.classList.add('dialogue');
                                                 
        gameScreen.appendChild(dialogueContainer);

        if (line.music) {
            musicHandler(line.music);
        }

        if (line.musicStop && currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
            currentMusic = null;
        }

        setTimeout(() => {
            element.classList.add('show');
            dialogueContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            if(!choicesShown && !suppressClickSound){

            }
            suppressClickSound = false;
        }, 50);

        currentDialogue++; 
    } else if (!choicesShown){
        choicesShown= true;

        const scene = scenes[currentScene];


        if(scene.continue){
            currentScene = scene.continue[0].next;
            renderScene();
        } else if(scene.choices){
            showChoices(scenes[currentScene].choices);
            playSound(choiceSound);
        }
    }
};

function showChoices(choices) {
    const choicesContainer = document.createElement('div');
    choicesContainer.classList.add('choicesContainer');

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.classList.add('choiceBtn');
        btn.textContent = choice.text;
        setTimeout(()=>{
            btn.classList.add('show');
            choicesContainer.scrollIntoView({ behavior: 'smooth', block: 'end'});
        })
        btn.onclick = ()=>{
            suppressClickSound = true;
            clickSound.pause();
            clickSound.currentTime = 0;
            
            choiceConfirm.play();
            choiceConfirm.currentTime = 0;
            btn.style.pointerEvents = "none";
            const container = btn.parentElement;
            container.querySelectorAll('.choiceBtn').forEach(b => {
            if (b !== btn) {
                b.style.opacity = '0.5'; 
                b.disabled = true;       
            } else {
                b.style.opacity = '1';
            }
        });
            currentScene = choice.next;
            renderScene();
           
        }
        choicesContainer.appendChild(btn);
        
    });
    gameScreen.appendChild(choicesContainer);
}

function pastDialogues(){
    const allDialogues = gameScreen.querySelectorAll('h2');
    allDialogues.forEach(dialogue => {
        dialogue.style.color = 'gray';
    });
}

gameScreen.addEventListener('click', () => {
    
    addDialogue();
});

const scenes = {
    intro: {
        text: [
            {text: `Simson\nSubject: PSNA CSE D Batch Reunion – Special Night!`},
            // {text: `Simson stares at the screen, adjusting his glasses.`},
            // {text: `“Hmm… maybe nvidia will be there… research break for one night won’t hurt.”`},
            // {text: `He clicks “Yes,” hiding a tab that definitely isn’t research.`},
            // {text: `Sharvesh\nSubject: Come meet your old friends!`},
            // {text: `“Murder rate in the city’s low this week. I can afford to attend....Time to seek some revenge”`},
            // {text: `He doesn’t notice the anonymous sender’s address isn’t PSNA’s usual domain.`},
            // {text: `Sharon\nSubject: Let’s reunite in the Lord’s joy!`},
            // {text: `“This is it… a hall full of sinners ready to be saved. By the end of the night, half of them will be Christians. The other half… well, I’ll work on them next time.”`},
            // {text: `“The Lord moves in mysterious ways… so do I 😉.”`},
            // {text: `Tharun\nSubject: Come with your twin spirit! Show us the prime time prime bro`},
            // {text: `“Finally… a chance to show them I made it. Time to be the superior twin.its PRIME TIME”`},
            // {text: `Syed\nSubject: Big gathering, big opportunities.`},
            // {text: `“Maybe I can move some barrels… call it charity work.”`},
            // {text: `Varshan`},
            // {text: `Subject: Old friends new deals!`},
            // {text: `Varshan leans back in his chair at the brothel office, counting cash.`},
            // {text: `“Reunion night? Business can wait… or maybe I’ll recruit some talent.”`},
            // {text: `Dhanush\nSubject: Bring your family!`},
            // {text: `“Varshan’s coming? Great… just great.”`},
            // {text: `Vikaas\nSubject: Special guest appearance.`},
            // {text: `“Finally, an audience without cameras… I think.”`},
            // {text: `Vishal R\nSubject: See your old batchmates!`},
            // {text: `“Amma, can I get Uber money for this?”`},
            // {text: `Vishal Kumar\nSubject: It’s been a while… friends!`},
            // {text: `“I could skip… but Soba will be there.”`},
            // {text: `A faint smirk forms.`},
            // {text: `“That’s reason enough.”`},
            // {text: `Yuvaneshar\nSubject: A family reunion… or something else?`},
            // {text: `Yuvaneshar scrolls through the email, side-eyeing 8 across the room.`},
            // {text: `“Married life is… fine. But PSNA reunions?, He exhales.”`},
            // {text: `“If the old gang’s coming… I better keep my guard up.”`},
            // {text: `Subish\nSubject: We might need your help.`},
            // {text: `Subish reads the invite and grins.`},
            // {text: `“Sounds ominous… but I’ll bring my medical kit… and drugs."`},
            // {text: `He pats his bag, where the paracetamol sits next to syringes of… less-than-legal substances.`},
            // {text: `“For… emergencies, of course.”`},
            // {text: `Sofiawari\nSubject: Simson will be there.`},
            // {text: `"Finally… maybe tonight I’ll tell him.”, She sighs dreamily.`},
            // {text: `Vel\nSubject: The King returns.`},
            // {text: `“They’ve forgotten who the Sulerumbu King is. Time to remind them.”`},
            // {text: `He adjusts his shades and clicks “Yes” on the RSVP.`},
            // {text: `Shri Ram & Sri Dhanush`},
            // {text: `Subject: Custody battle can wait… the reunion won’t.`},
            // {text: `They look at each other.`},
            // {text: `“They haven’t forgotten? Good.”`},
            // {text: `Both silently wonder if this is their chance to win over Sri Varshan — or at least ruin the other’s chances.`},
            // {text: `Scene 2 – “The Hall, 7:45 PM”`},
            // {text: `Camera pans over PSNA’s decorated alumni hall — plastic flowers, banners with "The Reunion of psna family"`},
            // {text: `Order of Arrivals`},
            // {text: `Sharvesh – walks in first, scanning for threats like he’s on duty. He thinks the “DJ” is a suspect.`},
            // {text: `Sofiawari – peeks in, spots Simson nowhere yet, clutches her dupatta nervously.`},
            // {text: `Tharun – steps in with his brand new adidas, slow motion, clearly trying to outshine his twin (who isn’t even there yet).`},
            // {text: `Syed – drops off a suspiciously heavy duffel bag near the snacks table.`},
            // {text: `Varshan – flanked by two “assistants” from his “business,” starts networking instantly.`},
            // {text: `Yuvaneshar & 8– clearly mid-argument as they ente`},
            // {text: `Sharon – carrying a Bible in one hand, He scans the crowd with a preacher’s smile.`},
            // {text: `"The Lord moves in mysterious ways… so do I,", he whispers`},
            // {text: `Vishal Kumar – pretends to wave at “everyone,” as he thinks to himself has sofa arrived.`},
            // {text: `Subish – wearing a doctor’s coat over party clothes, pockets clinking with contraband.`},
            // {text: `Shri Ram & Sri Dhanush – arrive together but clearly not speaking.`},
            // {text: `Shri Ram, wearing his Ajith Kumar Makkal Mandram party scarf, scans the room like it’s a political rally.`},
            // {text: `“This is not just a reunion… it’s a campaign opportunity.”`},
            // {text: `Simson – finally walks in late, laptop bag slung over shoulder, smelling faintly of… not research.`},
            {text: `You catch the faintest sound of footsteps—muted, as though the shoes themselves were fitted with silencers.`},
            {text: `The footsteps cease, and from beyond the door comes a language you don’t recognize—foreign, tribal, neither English nor Tamil.`},
            {text: `You recognize that the door is locked from the inside stopping the strangers from entering.`},
            {text: `As you consider opening the door, a commotion suddenly erupts inside.`}
        ],
        choices: [
            { text: "Open the door", next: "zuru_twins_arrives" },
            { text: "Check what the commotion is about", next: "pistol_monkey_game" }
        ]
    },

    zuru_twins_arrives: {
        text: [
            { text: "You open the lock."},
            { text: `The double doors slam open so hard they rattle on their hinges.`, music: "sulleraiya.wav"},
            { text: `Deep drumbeats echoes across the hall — BOOM.`},
            { text: `Two midgets in glittery red vests march in.`},
            { text: `One bangs tiny golden drums in a pounding rhythm`},
            { text: `The other carries something wrapped in red silk on a golden cushion.  `},
            { text: `**"The King is coming! The Sulerumbu King is coming!"** they shout in unison`},
            { text: `The DJ freezes mid-scratch.`},
            { text: `Lights drop to a dim red glow.`},
            { text: `A smoke machine hisses, filling the floor with low clouds. `},
            { text: `In the distance, a slow sitar riff begins, weaving with the drumbeats.`},
            { text: `From the haze, Vel emerges.`},
            { text: `He wears black shades, his expression unreadable.`},
            { text: `A long red silk shawl trails behind him like a comet’s tail.`},
            { text: `The first midget walks ahead of him, scattering **sugar crystals** onto the floor with every step — crunch, crunch, crunch.`},
            { text: `Vel stops in the center of the hall. `},
            { text: `The music dips into silence except for the slow thump of the drums.`},
            { text: `The second midget steps forward.`},
            { text: `With a dramatic flourish, he whips away the red silk to reveal…`},
            { text: `A crown carved entirely from sugarcane, shaped into the head of a giant ant, its mandibles sharp, the round butt jutting proudly out at the back like a strange royal seal.`},
            { text: `The crowd gasps. The midget rises on tiptoe, lifting the heavy crown, and gently lowers it onto Vel’s head.`},
            { text: `The drums stop.`},
            { text: `A beat of silence.`},
            { text: `Vel grips the mic.`},
            { text: `He looks over the crowd, smirks, and says:`},
            { text: `"Tonight… the kingdom of Sulerumbu extends to PSNA Hall! All who kneel before the ant shall rise as legends!"`, musicStop: "sulleraiya.wav"},
            { text: `For a split second, there’s stillness.`},
        ],
        choices: [
            { text: "Clap", next: "vel_ally" },
            { text: "Mock him", next: "vel_enemy" }
        ]
    },

    vel_ally: {
        text: [
            {text: `You clap loudly. Vel locks eyes with you and nods approvingly.`},
            {text: `You’ve gained +2 Respect from the Sulerumbu King.`}
        ],
        continue: [
            { next: "pistol_monkey_game"}
        ]
    },

    vel_enemy: {
        text: [
            {text: `"Oi, is this an erumbu circus or what?"`},
            {text: `Vel’s grin fades. You’ve gained +2 Rivalry with Vel.`}
        ],
        continue: [
            { next: "pistol_monkey_game"}
        ]
    },

    pistol_monkey_game: {
        text: [
            {text: ``},
        ],
        choices: [
            { text: "Go to bed", next: "end_sleep" }
        ]
    },

    talk_nvidia: {
        text: [
            "hi",
            "hello"
        ],
        choices: [
            {text: "blah", next: "hehe"}
        ]
    }
};

renderScene();
