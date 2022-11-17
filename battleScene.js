const battleBackgroundImage = new Image();
battleBackgroundImage.src = "game-assets/img/battleBackground.png";

const battleBackground = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
});

let enemyPokemon;
let myPokemon;
let renderedSprites;
let battleAnimationId;
let queue;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "block";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  // document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksContainer").replaceChildren();

  function randPokemon() {
    const keys = Object.keys(pokemons);
    const randPokemon = keys[Math.floor(Math.random() * keys.length)];
    return { ...pokemons[randPokemon], isEnemy: true };
  }

  enemyPokemon = new Pokemon(randPokemon());
  myPokemon = new Pokemon(pokemons.Charmander);
  renderedSprites = [myPokemon, enemyPokemon];
  queue = [];

  document.querySelector("#opponentName").innerHTML = enemyPokemon.name;

  document.querySelector(
    "#dialogueBox"
  ).innerHTML = `Encountered wild ${enemyPokemon.name}`;

  myPokemon.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector(".attacks-container").append(button);
  });

  function endBattle() {
    queue.push(() => {
      gsap.to("#overlappingDiv", {
        opacity: 1,
        onComplete: () => {
          cancelAnimationFrame(battleAnimationId);
          animate();
          document.querySelector("#userInterface").style.display = "none";

          gsap.to("#overlappingDiv", {
            opacity: 0,
          });

          battle.initiated = false;
          audio.map.play();
        },
      });
    });
  }

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      myPokemon.attack({
        attack: selectedAttack,
        recipient: enemyPokemon,
        renderedSprites,
      });

      if (enemyPokemon.health <= 0) {
        queue.push(() => {
          enemyPokemon.faint();
        });
        endBattle();
      }

      // Enemy attacks
      const randomAttack =
        enemyPokemon.attacks[
          Math.floor(Math.random() * enemyPokemon.attacks.length)
        ];

      queue.push(() => {
        enemyPokemon.attack({
          attack: randomAttack,
          recipient: myPokemon,
          renderedSprites,
        });

        if (myPokemon.health <= 0) {
          queue.push(() => {
            myPokemon.faint();
            return;
          });
          endBattle();
        }
      });
    });

    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

// animate();
// initBattle();
// animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});
