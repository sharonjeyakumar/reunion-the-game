const ostTruthAndLies = "ost/Truth-and-lies.mp3";
const audio = new Audio(ostTruthAndLies);

window.onload = function(){
    audio.play();
}

//Mainmenu 
const mainMenu = document.getElementById('mainMenu');
const playBtn = document.getElementById('playBtn');

playBtn.addEventListener('click', ()=>{
    mainMenu.style.opacity = 0;
    setTimeout(() => {
        mainMenu.style.display = 'none',
        gameScreen.style.display = 'block';
    }, 300);
    setTimeout(() => {
        addDialogue();
        
    }, 350);
});

//Game Scene
const gameScreen = document.getElementById('gameScreen');

let currentScene = "intro";
let currentDialogue = 0;
let dialogue = [];
let choicesShown = false;

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
        }, 50);

        currentDialogue++; 
    } else if (!choicesShown){
        choicesShown= true;
        showChoices(scenes[currentScene].choices)
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

gameScreen.addEventListener('click', () => {
    addDialogue();
});

const scenes = {
    intro: {
        text: [
            "Simson\nSubject: PSNA CSE D Batch Reunion – Special Night!",
            "Simson stares at the screen, adjusting his glasses.",
            "Hmm… maybe Nvidia will be there… research break for one night won’t hurt.",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
            "Hello",
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
    }
};

renderScene();
