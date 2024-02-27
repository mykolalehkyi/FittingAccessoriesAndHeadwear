import * as THREEts from "three";
import * as GUIts from "dat.gui";
import { GUI } from "../../../../libs/three.js-r132/examples/jsm/libs/dat.gui.module.js";

export class GuiHelper {
	private gui: GUIts.GUI;
	private folders = {}; // Object to store folder references

  public addGui(): GUIts.GUI {
    this.gui = new GUI();
    return this.gui;
  }

  public addPointLightToGui(light: THREEts.PointLight) {
	let folderName="Point Light";
    const lightFolder = this.gui.addFolder(folderName);
    lightFolder.add(light.position, <never>"x", -1000, 1000);
    lightFolder.add(light.position, <never>"y", -1000, 1000);
    lightFolder.add(light.position, <never>"z", -1000, 1000);
    lightFolder.add(light, "visible", true);
    lightFolder.add(light, "intensity", -10, 10);
    lightFolder.open();
	this.folders[folderName] = lightFolder;
  }

  public addDirectionalLightToGui(light: THREEts.DirectionalLight
  ) {
	let folderName="Directional Light";
    const lightFolder = this.gui.addFolder(folderName);
    lightFolder.add(light.position, <never>"x", -1000, 1000);
    lightFolder.add(light.position, <never>"y", -1000, 1000);
    lightFolder.add(light.position, <never>"z", -1000, 1000);
    lightFolder.add(light, "visible", true);
    lightFolder.add(light, "intensity", -10, 10);
    // light.target.
    lightFolder.open();
	this.folders[folderName] = lightFolder;
}

  public addHemisphereLightToGui(
    light: THREEts.HemisphereLight
  ) {
	let folderName="Hemisphere Light";
    const lightFolder = this.gui.addFolder(folderName);
    lightFolder.add(light.position, <never>"x", -1000, 1000);
    lightFolder.add(light.position, <never>"y", -1000, 1000);
    lightFolder.add(light.position, <never>"z", -1000, 1000);
    lightFolder.add(light, "visible", true);
    lightFolder.add(light, "intensity", -10, 10);
    // light.target.
    lightFolder.open();
	this.folders[folderName] = lightFolder;
}

  public addModelToGui(name: string, model: any) {
    const modelFolder = this.gui.addFolder(name);
    const positionFolder = modelFolder.addFolder("position");
    positionFolder.add(model.position, <never>"x", -10, 10);
    positionFolder.add(model.position, <never>"y", -10, 10);
    positionFolder.add(model.position, <never>"z", -10, 10);
    const scaleFolder = modelFolder.addFolder("scale");
    scaleFolder.add(model.scale, <never>"x", -10, 10);
    scaleFolder.add(model.scale, <never>"y", -10, 10);
    scaleFolder.add(model.scale, <never>"z", -10, 10);
    const rotationFolder = modelFolder.addFolder("rotation");
    rotationFolder.add(model.rotation, <never>"x", -10, 10);
    rotationFolder.add(model.rotation, <never>"y", -10, 10);
    rotationFolder.add(model.rotation, <never>"z", -10, 10);
	this.folders[name] = modelFolder;
}

  public removeFolderByName( name: string){
	this.gui.removeFolder(this.folders[name]);
	delete this.folders[name];
  }
}
