import { GUI } from "../../../../libs/three.js-r132/examples/jsm/libs/dat.gui.module.js";
export class GuiHelper {
    constructor() {
        this.folders = {}; // Object to store folder references
    }
    addGui() {
        this.gui = new GUI();
        return this.gui;
    }
    addPointLightToGui(light) {
        let folderName = "Point Light";
        const lightFolder = this.gui.addFolder(folderName);
        lightFolder.add(light.position, "x", -1000, 1000);
        lightFolder.add(light.position, "y", -1000, 1000);
        lightFolder.add(light.position, "z", -1000, 1000);
        lightFolder.add(light, "visible", true);
        lightFolder.add(light, "intensity", -10, 10);
        lightFolder.open();
        this.folders[folderName] = lightFolder;
    }
    addDirectionalLightToGui(light) {
        let folderName = "Directional Light";
        const lightFolder = this.gui.addFolder(folderName);
        lightFolder.add(light.position, "x", -1000, 1000);
        lightFolder.add(light.position, "y", -1000, 1000);
        lightFolder.add(light.position, "z", -1000, 1000);
        lightFolder.add(light, "visible", true);
        lightFolder.add(light, "intensity", -10, 10);
        // light.target.
        lightFolder.open();
        this.folders[folderName] = lightFolder;
    }
    addHemisphereLightToGui(light) {
        let folderName = "Hemisphere Light";
        const lightFolder = this.gui.addFolder(folderName);
        lightFolder.add(light.position, "x", -1000, 1000);
        lightFolder.add(light.position, "y", -1000, 1000);
        lightFolder.add(light.position, "z", -1000, 1000);
        lightFolder.add(light, "visible", true);
        lightFolder.add(light, "intensity", -10, 10);
        // light.target.
        lightFolder.open();
        this.folders[folderName] = lightFolder;
    }
    addModelToGui(name, model) {
        const modelFolder = this.gui.addFolder(name);
        const positionFolder = modelFolder.addFolder("position");
        positionFolder.add(model.position, "x", -10, 10);
        positionFolder.add(model.position, "y", -10, 10);
        positionFolder.add(model.position, "z", -10, 10);
        const scaleFolder = modelFolder.addFolder("scale");
        scaleFolder.add(model.scale, "x", -10, 10);
        scaleFolder.add(model.scale, "y", -10, 10);
        scaleFolder.add(model.scale, "z", -10, 10);
        const rotationFolder = modelFolder.addFolder("rotation");
        rotationFolder.add(model.rotation, "x", -10, 10);
        rotationFolder.add(model.rotation, "y", -10, 10);
        rotationFolder.add(model.rotation, "z", -10, 10);
        this.folders[name] = modelFolder;
    }
    removeFolderByName(name) {
        this.gui.removeFolder(this.folders[name]);
        delete this.folders[name];
    }
}
//# sourceMappingURL=gui-helper.js.map