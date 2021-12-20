function CanvasInit(canvas) {
   const BABYLON = window.BABYLON
   // const CANNON = window.CANNON
   const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

   const scene = new BABYLON.Scene(engine);

   const gravityVector = new BABYLON.Vector3(0,-9.81, 0);
   const physicsPlugin = new BABYLON.CannonJSPlugin();
   scene.enablePhysics(gravityVector, physicsPlugin);

   setInterval(function(){
      const sphere2 = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
      console.log(Math.random());
      sphere2.position.x = Math.random() * 10
      sphere2.position.z = Math.random() * 10
      sphere2.position.y = 20
      sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 100, restitution: 0.3 }, scene);
   },500)
   const ground = BABYLON.Mesh.CreateGround("ground1", 60, 60, 2, scene);

  
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
  


   const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
   camera.attachControl(canvas, true);
   const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));


   // Register a render loop to repeatedly render the scene
   engine.runRenderLoop(function () {
      scene.render();
   });

   // Watch for browser/canvas resize events
   window.addEventListener("resize", function () {
      engine.resize();
   });
}

export default CanvasInit