import { Weapon, Laser } from './parts/weapon';
import { Shield } from './parts/shield';
import { animalId, numericId } from 'short-animal-id';

class Ship {
  equipment = [];
  modifiers = [];
  baseStat = {};
  state = {};

  constructor() {
    this.id = `${animalId()}-${numericId(2)}`;
  }
  log(s) {
    console.log(`${this.id} [${this.constructor.name}]: ${s}`);
  }
  initializeState() {
    this.state = {
      target: null,
      posX: 0,
      posY: 0,
      ...this.baseStat,
    };
  }
  get isDead() {
    return this.state.health <= 0;
  }
  tryDodge() {
    // returns if successfully dodged
    return Math.random() < this.state.dodge;
  }
  setTarget(ship) {
    this.state.target = ship;
  }
  addEquipment(equipment) {
    if (this.state.equipmentSlots > this.equipment.length) {
      this.equipment.push(equipment);
    } else {
      this.log('too much equipment');
    }
  }
  addModifier(mod) {
    if (this.state.modifierSlots > this.modifiers.length) {
      this.modifiers.push(this.modifiers);
    } else {
      this.log('too many mods');
    }
  }
  takeHit(dmg, isAvoidable) {
    if (dmg == 0) return;
    if (isAvoidable && this.tryDodge()) {
      this.log(`*DODGED* ${dmg} dmg`);
      return;
    }
    this.log(`taking ${dmg} dmg`);
    // random shield, if any, takes damage
    const shields = this.equipment.filter((e) => e instanceof Shield);
    const dmgTaken = 0;
    if (shields.length) {
      const randomShield = shields[Math.floor(Math.random() * shields.length)];
      dmgTaken = randomShield.takeHit(dmg);
    }
    if (dmg > dmgTaken) {
      // remaining damage is dealt to ship
      this.state.health = Math.max(this.state.health - (dmg - dmgTaken), 0);
    }

    if (this.state.health == 0) {
      this.log('ship died.');
    }
  }
  tick(ms) {
    this.equipment.forEach((e) => {
      e.tick(ms);
      if (e instanceof Weapon && e.readyToFire) {
        if (!this.state.target) {
          this.log('no target selected.');
          return;
        }
        // don't fire at dead targets
        if (this.state.target.isDead) {
          this.state.target = null;
          return;
        }

        let isAvoidable = !(e instanceof Laser); // lasers can't be dodged
        e.fire().forEach((shot) => {
          this.state.target.takeHit(shot, isAvoidable);
        });
      }
    });
    // TODO: move
  }
}

export class Fighter extends Ship {
  constructor() {
    super();
    this.initializeState();
  }
  baseStat = {
    speed: 14,
    health: 300,
    dodge: 0.6,
    equipmentSlots: 3,
    modifierSlots: 2,
  };
}
export class Gunship extends Ship {
  constructor() {
    super();
    this.initializeState();
  }
  baseStat = {
    speed: 10,
    health: 600,
    dodge: 0.4,
    equipmentSlots: 5,
    modifierSlots: 2,
  };
}
export class Frigate extends Ship {
  constructor() {
    super();
    this.initializeState();
  }
  baseStat = {
    speed: 8,
    health: 900,
    dodge: 0.3,
    equipmentSlots: 6,
    modifierSlots: 3,
  };
}

export class Destroyer extends Ship {
  constructor() {
    super();
    this.initializeState();
  }
  baseStat = {
    speed: 6,
    health: 1200,
    dodge: 0.2,
    equipmentSlots: 8,
    modifierSlots: 3,
  };
}

export class Cruiser extends Ship {
  constructor() {
    super();
    this.initializeState();
  }
  baseStat = {
    speed: 4,
    health: 1600,
    dodge: 0.1,
    equipmentSlots: 10,
    modifierSlots: 4,
  };
}

export class BattleShip extends Ship {
  constructor() {
    super();
    this.initializeState();
  }
  baseStat = {
    speed: 3,
    health: 2000,
    dodge: 0.05,
    equipmentSlots: 12,
    modifierSlots: 5,
  };
}
