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
            { text: "As tempers flare, the room descends into utter chaos—shouts echo, fists fly, and the air thickens with tension. People push and shove, their anger unleashed in a frenzy of violence."},
            { text: "Suddenly, cutting sharply through the cacophony, a piercing screech rends the air—an eerie, haunting sound that forces everyone to momentarily freeze."},
            { text: "From above, a massive hawk descends with terrifying grace. Nearly 2 feet tall, its wings spread wide—stretching over 4 feet—casting a vast shadow over the crowd. Its powerful talons reach out like iron claws, ready to seize its prey.", music: "hawk.mp3"},
            { text: "Gasps ripple through the crowd as all eyes fixate on the unbelievable sight: Pranav of CSE C, perched atop the giant hawk, gripping tightly with fierce determination. The bird’s muscles tense as it swoops down, snatching Vel into its grasp with swift precision."},
        ],
        choices: [
            { text: "Go to the reunion you wanted to go", next: "reunion_entry" },
            { text: "Stay home", next: "stay_home" }
        ]
    },

    reunion_entry: {
        text: [
            { text: "The hall is buzzing with laughter. Old friends gather in small circles."},
            { text: "You spot Nivi near the buffet table."}
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
