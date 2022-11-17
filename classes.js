class Boundary {
  static width = 49.2;
  static height = 49.2;
  constructor({ position, width, height }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(0,0,0,0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  static playerWidth = 192;
  static playerHeight = 68;
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
    this.scale = scale;
  }

  draw() {
    // c.drawImage(this.image, this.position.x, this.position.y);
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frames.max) * this.scale,
      this.image.height * this.scale
    );
    c.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else {
        this.frames.val = 0;
      }
    }
  }
}

class Pokemon extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks,
    scale,
    health,
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale,
    });
    if (isEnemy) {
      this.image.src = image.front.src;
      this.position = { x: 800, y: 65 };
    } else {
      this.image.src = image.back.src;
      this.position = { x: 270, y: 285 };
    }
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
    this.health = health;
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML = `${this.name} fainted!`;
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
    audio.victory.play();
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector(
      "#dialogueBox"
    ).innerHTML = `${this.name} used ${attack.name}`;

    let healthBar = "#enemyHealthBar";
    let rotation = 1;

    if (this.isEnemy) {
      healthBar = "#playerHealthBar";
      rotation = 5;
    }

    recipient.health -= attack.damage;

    let currentHealth = document.querySelector("#currentHealth");
    let newHealth = currentHealth.innerHTML - attack.damage;

    switch (attack.name) {
      case "Ember":
        audio.initFireball.play();

        const emberImage = new Image();
        emberImage.src = "game-assets/img/fireball.png";

        const ember = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: emberImage,
          frames: { max: 4, hold: 10 },
          animate: true,
          rotation,
        });

        renderedSprites.splice(1, 0, ember);

        gsap.to(ember.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            audio.fireballHit.play();

            gsap.to(healthBar, {
              width: recipient.health + "%",
            });

            if (this.isEnemy) currentHealth.innerHTML = newHealth;

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient.opacity, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });
        break;

      case "Tackle":
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, { x: this.position.x - movementDistance })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              audio.tackleHit.play();

              gsap.to(healthBar, {
                width: recipient.health + "%",
              });

              if (this.isEnemy) currentHealth.innerHTML = newHealth;

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              gsap.to(recipient.opacity, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, { x: this.position.x });
        break;

      default:
        break;
    }
  }
}
