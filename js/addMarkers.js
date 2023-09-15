AFRAME.registerComponent("create-markers", {
  
  init: async function() {

    var mainScene = document.querySelector("#main-scene");

    //get the toys collection from firestore database
    var toys = await this.getToys();
   
    toys.map(Toy => {
      var marker = document.createElement("a-marker");   
      marker.setAttribute("id", Toy.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", Toy.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse"
      });

      //set the markerhandler component
      marker.setAttribute("markerhandler", {});
      mainScene.appendChild(marker);

      // Adding 3D model to scene
      var model = document.createElement("a-entity");    
     
      model.setAttribute("id", `model-${Toy.id}`);
      model.setAttribute("position", Toy.model_geometry.position);
      model.setAttribute("rotation", Toy.model_geometry.rotation);
      model.setAttribute("scale", Toy.model_geometry.scale);
      model.setAttribute("gltf-model", `url(${Toy.model_url})`);
      model.setAttribute("gesture-handler", {});
      marker.appendChild(model);

      // description Container
      var mainPlane = document.createElement("a-plane");
      mainPlane.setAttribute("id", `main-plane-${Toy.id}`);
      mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
      mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      mainPlane.setAttribute("width", 1.7);
      mainPlane.setAttribute("height", 1.5);
      marker.appendChild(mainPlane);

      // Toy title background plane
      var titlePlane = document.createElement("a-plane");
      titlePlane.setAttribute("id", `title-plane-${Toy.id}`);
      titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
      titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      titlePlane.setAttribute("width", 1.69);
      titlePlane.setAttribute("height", 0.3);
      titlePlane.setAttribute("material", { color: "#F0C30F" });
      mainPlane.appendChild(titlePlane);

      // Toy title
      var ToyTitle = document.createElement("a-entity");
      ToyTitle.setAttribute("id", `Toy-title-${Toy.id}`);
      ToyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
      ToyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      ToyTitle.setAttribute("text", {
        font: "monoid",
        color: "black",
        width: 1.8,
        height: 1,
        align: "center",
        value: Toy.Toy_name.toUpperCase()
      });
      titlePlane.appendChild(ToyTitle);

      // description List
      var description = document.createElement("a-entity");
      description.setAttribute("id", `description-${Toy.id}`);
      description.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
      description.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      description.setAttribute("text", {
        font: "monoid",
        color: "black",
        width: 2,
        align: "left",
        value: `${Toy.description}`
      });
      mainPlane.appendChild(description);
    });
  },
  //function to get the toys collection from firestore database
  getToys: async function() {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});
