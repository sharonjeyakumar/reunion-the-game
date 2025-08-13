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
        backBtn.classList.add('show');
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

function addDialogue(){
    if(currentDialogue <= dialogue.length-1){

        const dialogueContainer = document.createElement('div');
        dialogueContainer.classList.add('dialogueContainer');

        const element = document.createElement('h2');
        element.textContent = dialogue[currentDialogue];
        dialogueContainer.appendChild(element);
        element.classList.add('dialogue');

        gameScreen.appendChild(dialogueContainer);

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
        showChoices(scenes[currentScene].choices);
        playSound(choiceSound);
        
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
            "Simson\nSubject: PSNA CSE D Batch Reunion – Special Night!",
            "Simson stares at the screen, adjusting his glasses.",
            // "“Hmm… maybe nvidia will be there… research break for one night won’t hurt.”",
            // "He clicks “Yes,” hiding a tab that definitely isn’t research.",
            // "Sharvesh\nSubject: Come meet your old friends!",
            // "“Murder rate in the city’s low this week. I can afford to attend… might get free food.”",
            // "He doesn’t notice the anonymous sender’s address isn’t PSNA’s usual domain.",
            // "Sharon\nSubject: Let’s reunite in the Lord’s joy!",
            // "“This is it… a hall full of sinners ready to be saved. By the end of the night, half of them will be Christians. The other half… well, I’ll work on them next time.”",
            // "“The Lord moves in mysterious ways… so do I 😉.”",
            // "Tharun\nSubject: Come with your twin spirit! Show us the prime time prime bro",
            // "“Finally… a chance to show them I made it. Time to be the superior twin.”",
            // "Syed\nSubject: Big gathering, big opportunities.",
            // "“Maybe I can move some barrels… call it charity work.”",
            // "Varshan\nSubject: Old friends new deals!",
            // "Varshan leans back in his chair at the brothel office, counting cash.",
            // "“Reunion night? Business can wait… or maybe I’ll recruit some talent.”",
            // "Dhanush\nSubject: Bring your family!",
            // "“Varshan’s coming? Great… just great.”",
            // "Vikaas\nSubject: Special guest appearance.",
            // "“Finally, an audience without cameras… I think.”",
            // "Vishal R\nSubject: See your old batchmates!",
            // "“Amma, can I get Uber money for this?”",
            // "Vishal Kumar\nSubject: It’s been a while… friends!",
            // "“I could skip… but Sofa will be there.”",
            // "A faint smirk forms.",
            // "“That’s reason enough.”",
            // "Yuvenesh\nSubject: A family reunion… or something else?",
            // "Yuvenesh scrolls through the email, side-eyeing 8 across the room.",
            // "“Married life is… fine. But PSNA reunions?”, He exhales.",
            // "“If the old gang’s coming… I better keep my guard up.”",
            // "Subish\nSubject: We might need your help.",
            // "Subish reads the invite and grins.",
            // "“Sounds ominous… but I’ll bring my medical kit… and drugs.”",
            // "He pats his bag, where the paracetamol sits next to syringes of… less-than-legal substances.",
            // "“For… emergencies, of course.”",
            // "Sofiwari\nSubject: Simson will be there.",
            // "She sighs dreamily.",
            // "“Finally… maybe tonight I’ll tell him.”",
            // "Vel\nSubject: The King returns.",
            // "“They’ve forgotten who the Sulerumbu King is. Time to remind them.”",
            // "He adjusts his shades and clicks “Yes” on the RSVP.",
            // "Shri Ram & Sri Dhanush\nSubject: Custody battle can wait… the reunion won’t.",
            // "They look at each other.",
            // "“They haven’t forgotten? Good.”",
            // "Both silently wonder if this is their chance to win over Sri Varshan — or at least ruin the other’s chances.",
        ],
        choices: [
            { text: "Go to the reunion you wanted to go", next: "reunion_entry" },
            { text: "Stay home", next: "stay_home" }
        ]
    },

    reunion_entry: {
        text: [
            "The hall is buzzing with laughter. Old friends gather in small circles.",
            "You spot Nivi near the buffet table."
        ],
        choices: [
            { text: "Talk to nvidia", next: "talk_nvidia" },
            { text: "Grab food first", next: "buffet" }
        ]
    },

    stay_home: {
        text: [
            "You stay home and binge-watch your favorite series.",
            "It’s peaceful… but you can’t shake off the feeling of missing out."
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
