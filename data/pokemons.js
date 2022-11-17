const pokemons = {
  Bulbasaur: {
    image: {
      front: {
        src: "../game-assets/img/pokemon/001 - bulbasaur/spriteFront.png",
      },
      back: {
        src: "../game-assets/img/pokemon/001 - bulbasaur/spriteBack.png",
      },
    },
    frames: { max: 99, hold: 5 },
    scale: 3,
    animate: true,
    name: "Bulbasaur",
    attacks: [attacks.Tackle, attacks.Ember],
  },

  Charmander: {
    image: {
      front: {
        src: "../game-assets/img/pokemon/004 - charmander/spriteFront.png",
      },
      back: {
        src: "../game-assets/img/pokemon/004 - charmander/spriteBack.png",
      },
    },
    frames: { max: 107, hold: 5 },
    scale: 3,
    animate: true,
    name: "Charmander",
    attacks: [attacks.Tackle, attacks.Ember],
  },

  Squirtle: {
    image: {
      front: {
        src: "../game-assets/img/pokemon/007 - squirtle/spriteFront.png",
      },
      back: {
        src: "../game-assets/img/pokemon/007 - squirtle/spriteBack.png",
      },
    },
    frames: { max: 51, hold: 5 },
    scale: 3,
    animate: true,
    name: "Squirtle",
    attacks: [attacks.Tackle, attacks.Ember],
  },
};
