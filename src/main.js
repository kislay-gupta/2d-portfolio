import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});

const officeAssets = {
  "office-carpet": new URL(
    "../modern-office-tileset-16x16-free-sample/tiles/floor_carpet.png",
    import.meta.url
  ).href,
  "office-wood": new URL(
    "../modern-office-tileset-16x16-free-sample/tiles/floor_wood.png",
    import.meta.url
  ).href,
  "office-wall-left": new URL(
    "../modern-office-tileset-16x16-free-sample/tiles/wall_cap_left.png",
    import.meta.url
  ).href,
  "office-wall-center": new URL(
    "../modern-office-tileset-16x16-free-sample/tiles/wall_cap_center.png",
    import.meta.url
  ).href,
  "office-wall-right": new URL(
    "../modern-office-tileset-16x16-free-sample/tiles/wall_cap_right.png",
    import.meta.url
  ).href,
  "office-wall-lower": new URL(
    "../modern-office-tileset-16x16-free-sample/tiles/wall_lower.png",
    import.meta.url
  ).href,
  "office-desk": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/desk.png",
    import.meta.url
  ).href,
  "office-desk-monitor": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/desk_monitor.png",
    import.meta.url
  ).href,
  "office-chair-down": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/chair_office_down.png",
    import.meta.url
  ).href,
  "office-chair-up": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/chair_office_up.png",
    import.meta.url
  ).href,
  "office-bookshelf": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/bookshelf.png",
    import.meta.url
  ).href,
  "office-whiteboard": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/whiteboard.png",
    import.meta.url
  ).href,
  "office-sofa": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/sofa.png",
    import.meta.url
  ).href,
  "office-filing-cabinet": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/filing_cabinet.png",
    import.meta.url
  ).href,
  "office-printer": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/printer.png",
    import.meta.url
  ).href,
  "office-water-dispenser": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/water_dispenser.png",
    import.meta.url
  ).href,
  "office-plant-big": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/plant_big.png",
    import.meta.url
  ).href,
  "office-plant-small": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/plant_small.png",
    import.meta.url
  ).href,
  "office-coffee-table": new URL(
    "../modern-office-tileset-16x16-free-sample/objects/coffee_table.png",
    import.meta.url
  ).href,
};

for (const [name, url] of Object.entries(officeAssets)) {
  k.loadSprite(name, url);
}

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", () => {
  const player = k.make([
    k.sprite("spritesheet", { anim: "idle-down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  const tileSize = 16 * scaleFactor;
  const office = { left: 2, right: 31, top: 3, bottom: 26 };

  function addOfficeSprite(name, x, y) {
    k.add([k.sprite(name), k.pos(x * tileSize, y * tileSize), k.scale(scaleFactor)]);
  }

  function addBoundary(x, y, width, height, name) {
    k.add([
      k.area({
        shape: new k.Rect(k.vec2(0), width * tileSize, height * tileSize),
      }),
      k.body({ isStatic: true }),
      k.pos(x * tileSize, y * tileSize),
      ...(name ? [name] : []),
    ]);
  }

  for (let y = office.top + 2; y < office.bottom; y++) {
    for (let x = office.left; x <= office.right; x++) {
      addOfficeSprite(y > 21 ? "office-wood" : "office-carpet", x, y);
    }
  }

  addOfficeSprite("office-wall-left", office.left, office.top);
  addOfficeSprite("office-wall-right", office.right, office.top);
  for (let x = office.left + 1; x < office.right; x++) {
    addOfficeSprite("office-wall-center", x, office.top);
    addOfficeSprite("office-wall-lower", x, office.top + 1);
  }

  addBoundary(office.left, office.top, office.right - office.left + 1, 2);
  addBoundary(office.left, office.bottom, office.right - office.left + 1, 1);
  addBoundary(office.left, office.top, 1, office.bottom - office.top + 1);
  addBoundary(office.right, office.top, 1, office.bottom - office.top + 1);

  const stations = [
    ["office-desk-monitor", 5, 7, 2, 2, "pc"],
    ["office-whiteboard", 11, 6, 2, 2, "cs-degree"],
    ["office-desk-monitor", 17, 7, 2, 2, "resume"],
    ["office-bookshelf", 23, 5, 2, 3, "library"],
    ["office-whiteboard", 28, 6, 2, 2, "projects"],
    ["office-sofa", 5, 18, 3, 2, "sofa-table"],
    ["office-printer", 16, 19, 1, 1, "tv"],
    ["office-filing-cabinet", 26, 18, 1, 2, "bed"],
  ];

  for (const [sprite, x, y, width, height, name] of stations) {
    addOfficeSprite(sprite, x, y);
    addBoundary(x, y, width, height, name);
    player.onCollide(name, () => {
      if (player.isInDialogue) return;
      player.isInDialogue = true;
      displayDialogue(dialogueData[name], () => (player.isInDialogue = false));
    });
  }

  const furniture = [
    ["office-desk", 11, 12, 2, 2],
    ["office-chair-down", 12, 14, 1, 2],
    ["office-desk", 20, 12, 2, 2],
    ["office-chair-down", 21, 14, 1, 2],
    ["office-water-dispenser", 3, 12, 1, 2, "water-cooler"],
    ["office-plant-big", 28, 16, 2, 2],
    ["office-plant-small", 3, 22, 1, 1],
    ["office-plant-small", 29, 22, 1, 1],
    ["office-coffee-table", 11, 20, 2, 1],
    ["office-chair-up", 12, 22, 1, 2],
  ];

  for (const [sprite, x, y, width, height, name] of furniture) {
    addOfficeSprite(sprite, x, y);
    addBoundary(x, y, width, height, name);
  }

  let waterCoolerHits = 0;
  let lastWaterCoolerHit = 0;
  let hydrationGameActive = false;
  let collectedDrops = 0;

  function finishHydrationGame() {
    hydrationGameActive = false;
    player.isInDialogue = true;
    displayDialogue(
      "Hydration complete! You found the office easter egg.",
      () => (player.isInDialogue = false)
    );
  }

  function startHydrationGame() {
    player.isInDialogue = true;
    displayDialogue(
      "Hydration break unlocked! Close this message, then collect the 5 water drops around the office.",
      () => {
        player.isInDialogue = false;
        hydrationGameActive = true;
        collectedDrops = 0;

        [
          [7, 13],
          [10, 17],
          [16, 11],
          [23, 17],
          [27, 13],
        ].forEach(([x, y]) => {
          k.add([
            k.circle(8),
            k.color(95, 190, 255),
            k.area(),
            k.pos(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2),
            "water-drop",
          ]);
        });
      }
    );
  }

  player.onCollide("water-cooler", () => {
    if (hydrationGameActive || player.isInDialogue) return;

    const now = Date.now();
    waterCoolerHits = now - lastWaterCoolerHit < 1500 ? waterCoolerHits + 1 : 1;
    lastWaterCoolerHit = now;

    if (waterCoolerHits === 2) {
      waterCoolerHits = 0;
      startHydrationGame();
    }
  });

  player.onCollide("water-drop", (drop) => {
    if (!hydrationGameActive) return;

    k.destroy(drop);
    collectedDrops++;

    if (collectedDrops === 5) finishHydrationGame();
  });

  player.pos = k.vec2(17 * tileSize, 16 * tileSize);
  k.add(player);

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }
  });

  function stopAnims() {
    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }

    player.play("idle-side");
  }

  k.onMouseRelease(stopAnims);

  k.onKeyRelease(() => {
    stopAnims();
  });
  k.onKeyDown((key) => {
    const keyMap = [
      k.isKeyDown("right"),
      k.isKeyDown("left"),
      k.isKeyDown("up"),
      k.isKeyDown("down"),
    ];

    let nbOfKeyPressed = 0;
    for (const key of keyMap) {
      if (key) {
        nbOfKeyPressed++;
      }
    }

    if (nbOfKeyPressed > 1) return;

    if (player.isInDialogue) return;
    if (keyMap[0]) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      player.move(player.speed, 0);
      return;
    }

    if (keyMap[1]) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      player.move(-player.speed, 0);
      return;
    }

    if (keyMap[2]) {
      if (player.curAnim() !== "walk-up") player.play("walk-up");
      player.direction = "up";
      player.move(0, -player.speed);
      return;
    }

    if (keyMap[3]) {
      if (player.curAnim() !== "walk-down") player.play("walk-down");
      player.direction = "down";
      player.move(0, player.speed);
    }
  });
});

k.go("main");
