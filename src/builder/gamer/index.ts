type CharType = 'healer' | 'attacker' | 'tank';

type WeaponType = {
  bestClass: CharType;
  attack: number;
};

class Gamer {
  type: CharType;
  weapon: WeaponType = { bestClass: 'attacker', attack: 0 };
  health = 100;
  defense = 10;
  attack = 10;

  constructor() {
    this.type = 'healer';
  }
}

class GamerBuilder {
  private char: Gamer;

  setType(newType: CharType) {
    this.char.type = newType;
  }

  setWeapon(weapon: WeaponType) {
    this.char.weapon = weapon;
  }

  setHealth(health: number) {
    this.char.health = health;
  }

  setDefense(defense: number) {
    this.char.defense = defense;
  }

  setAttack(attack: number) {
    this.char.attack = attack;
    if (this.char.type === 'healer' && attack > 20) attack = 20;
  }

  constructor() {
    this.char = new Gamer();
  }

  getGamer() {
    return this.char;
  }
}

const builder = new GamerBuilder();

builder.setType('healer');
builder.setAttack(50);
builder.setDefense(10);
builder.setWeapon({ bestClass: 'healer', attack: 5 });

const newGamer = builder.getGamer();
console.log(`myChar`, newGamer);
