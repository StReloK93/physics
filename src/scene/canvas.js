function CanvasInit(canvas) {
   const BABYLON = window.BABYLON
   const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
   var scene = new BABYLON.Scene(engine);
   // camera setup -------------------------------------------------------------------------------------------------------------
   var camera = new BABYLON.ArcRotateCamera("camera0",-Math.PI / 2 - 0.2, 1.2,7, null, scene, true);
   camera.inputs.remove(camera.inputs.attached.keyboard);
   camera.inputs.remove(camera.inputs.attached.mousewheel);
   camera.lockedTarget = player;
   camera.attachControl(canvas, true);
   var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.2, 1, 0.2), scene);
   light.intensity = 0.3



   // player setup -------------------------------------------------------------------------------------------------------------
   var pwidth = 0.5;
   var pheight = 1.8;
   var pdepth = 0.5;
   var player = new BABYLON.MeshBuilder.CreateSphere("player", {diameterY: pheight,diameterX: pwidth,diameterZ: pdepth});
   player.material = new BABYLON.StandardMaterial("playerMat", scene);
   player.position = new BABYLON.Vector3(1, 3, 1);
   player.checkCollisions = true;
   player.ellipsoid = new BABYLON.Vector3(pwidth / 2,pheight / 2,pdepth / 2);


   player.contactRay = new BABYLON.Ray(player.position,new BABYLON.Vector3(0, -1.01, 0));
   player.contactRay.length = 0.901;

   player.inputDirection = new BABYLON.Vector3(0, 0, 0);
   player.velocity = new BABYLON.Vector3(0, 0, 0);
   player.normal = new BABYLON.Vector3(0, 1, 0);

   // state
   player.falling = true;
   player.climbing = false;
   player.sprinting = false;
   player.jump = false;

   // settings
   player.jumpSpeed = 7;
   player.moveSpeed = 6;
   player.sprintSpeed = 10;

   // user input --------------------------------------------------------------------------------------------------------------
   scene.onKeyboardObservable.add((kbinfo) => {
      if (kbinfo.event.code == "ArrowUp") {
         player.inputDirection.z = kbinfo.event.type == "keydown" ? 1 : 0;
      } else if (kbinfo.event.code == "ArrowDown") {
         player.inputDirection.z = kbinfo.event.type == "keydown" ? -1 : 0;
      } else if (kbinfo.event.code == "ArrowRight") {
         player.inputDirection.x = kbinfo.event.type == "keydown" ? 1 : 0;
      } else if (kbinfo.event.code == "ArrowLeft") {
         player.inputDirection.x = kbinfo.event.type == "keydown" ? -1 : 0;
      } else if (kbinfo.event.key == "Shift") {
         player.sprinting = kbinfo.event.type == "keydown" ? true : false;
      } else if (kbinfo.event.code == "Space" && !player.falling) {
         player.jump = true;
      }
   });


   // build a world to interact with -------------------------------------------------------------------------------------------
   var obstacles = [];



   // obstacles ---------------------------------------------------------------------------------------------------------------
   var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
   ground.checkCollisions = true;
   obstacles.push(ground);

   var box = BABYLON.MeshBuilder.CreateBox("box", { width: 3, depth: 3 }, scene);
   box.position = new BABYLON.Vector3(5, 0.5, 3);
   // box.checkCollisions = true;
   obstacles.push(box);

   // trampoline
   var trampoline = BABYLON.MeshBuilder.CreateBox("trampoline", { size: 1 }, scene);
   trampoline.position = new BABYLON.Vector3(3, 0, 10);
   trampoline.scaling.y = 0.3;
   trampoline.checkCollisions = true;
   obstacles.push(trampoline);


   // main loop --------------------------------------------------------------------------------------------------------------
   engine.onBeginFrameObservable.add(() => {
      var dt = engine.getDeltaTime() / 1000;

      var externalPhysicalImpact = false;

      var results = [];
      player.contactRay.intersectsMeshes(obstacles,false,results);
      if (results.length > 0) {
         player.falling = false;
         player.material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
         player.normal = results[0].getNormal();

         if (results[0].pickedMesh.name == "trampoline") {
            player.velocity.y = 10;
            externalPhysicalImpact = true;
         }
      } else {
         player.material.emissiveColor = new BABYLON.Color4(0, 1, 0, 1);
         player.falling = true;
      }

      if (player.jump) {
         player.jump = false;
         player.falling = true;
         player.velocity.y = player.jumpSpeed;
      }

      // copy rotation from camera orientation if camera was turned and player is about to be moved ---------------
      if (player.inputDirection.length() > 0.1) {
         player.rotation.y = Math.PI / 2 - camera.alpha + Math.PI;
      }

      // input form player + pyhsical interaction -----------------------------------------------------------------
      const velocityIntended = player.inputDirection.normalize().scale(player.sprinting ? player.sprintSpeed : player.moveSpeed);

      // combine kinematic impacts such as gravity ----------------------------------------------------------------
      const velocityPhysics = new BABYLON.Vector3(0, 0, 0);

      if (player.falling || externalPhysicalImpact) {
         velocityPhysics.y = player.velocity.y - 9.81 * dt;
         player.velocity.y = velocityPhysics.y;
      }

      const toWorld = new BABYLON.Matrix.RotationYawPitchRoll(player.rotation.y, 0, 0);

      const moveCombined = velocityPhysics.add(BABYLON.Vector3.TransformCoordinates(velocityIntended, toWorld));

      // move the player based on input + physics
      player.moveWithCollisions(moveCombined.scale(dt));

   });


   engine.runRenderLoop(() => {scene.render()});
   window.addEventListener("resize", () => {engine.resize()});
}

export default CanvasInit
// scene.onPointerDown = evt => {scene.getEngine().enterPointerlock()}