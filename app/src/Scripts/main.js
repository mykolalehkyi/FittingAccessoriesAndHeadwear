import { loadGLTF, loadRGBE } from "../../../libs/loader.js";
import { TryOnService } from "./Services/try-on-service.js";
import { GuiHelper } from "./Helper/gui-helper.js";
import { StatsHelper } from "./Helper/stats-helper.js";
export const THREE = window.MINDAR.FACE.THREE;
class AppRun {
    constructor() {
        this.tryOnService = new TryOnService();
        this.guiHelper = new GuiHelper();
        this.statsHelper = new StatsHelper();
        this.controls = {
            selections: () => document.querySelector("#selections"),
        };
        this.init();
    }
    capture(mindarThree) {
        const { video, renderer, scene, camera } = mindarThree;
        const renderCanvas = renderer.domElement;
        // Output canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = renderCanvas.width;
        canvas.height = renderCanvas.height;
        const sx = (((video.clientWidth - renderCanvas.clientWidth) / 2) *
            video.videoWidth) /
            video.clientWidth;
        const sy = (((video.clientHeight - renderCanvas.clientHeight) / 2) *
            video.videoHeight) /
            video.clientHeight;
        const sw = video.videoWidth - sx * 2;
        const sh = video.videoHeight - sy * 2;
        context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        renderer.preserveDrawingBuffer = true;
        renderer.render(scene, camera); // empty if not run
        context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
        renderer.preserveDrawingBuffer = false;
        const data = canvas.toDataURL("image/png");
        return data;
    }
    init() {
        let that = this;
        document.addEventListener("DOMContentLoaded", () => {
            const start = async () => {
                // mockWithVideo('../../../assets/mock-videos/face2.mp4');
                that.mindarThree = new (window).MINDAR.FACE.MindARThree({
                    container: document.body,
                });
                const { renderer, scene, camera } = that.mindarThree;
                this.guiHelper.addGui();
                let occluder = await this.addOccluder(that.mindarThree);
                //Adding light
                const pointLight = this.addPointLight(scene);
                this.guiHelper.addPointLightToGui(pointLight);
                const directionalLight = this.addDirectionalLight(scene);
                this.guiHelper.addDirectionalLightToGui(directionalLight.light);
                directionalLight.light.target = occluder.scene;
                // const hemisphereLight: THREEts.HemisphereLight =
                //   this.addHemisphereLight(scene);
                // this.guiHelper.addHemisphereLightToGui(hemisphereLight);
                const background = await this.addBackgroundToScene(scene);
                this.guiHelper.addBackgroundToGui(scene, background);
                this.addTryOnButtons(that.mindarThree);
                this.initPreviewShare(that.mindarThree);
                this.statsHelper.addStatsFPS();
                this.statsHelper.addStatsMB();
                this.statsHelper.addStatsMS();
                await that.mindarThree.start();
                renderer.setAnimationLoop(() => {
                    renderer.render(scene, camera);
                    this.statsHelper.getStatsFPS().update();
                    this.statsHelper.getStatsMB().update();
                    this.statsHelper.getStatsMS().update();
                    directionalLight.helper.update();
                    let lightIntensity = that.calculateLightIntensity(that.mindarThree);
                    that.updateLightIntesivity(pointLight, lightIntensity);
                    that.updateLightIntesivity(directionalLight.light, lightIntensity);
                });
            };
            start();
        });
    }
    updateLightIntesivity(light, lightIntensity) {
        light.intensity = lightIntensity;
    }
    calculateLightIntensity(mindarThree) {
        let that = this;
        const width = mindarThree.renderer.domElement.width;
        const height = mindarThree.renderer.domElement.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(mindarThree.video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const rgbaData = imageData.data;
        let averageLuminosity = 0;
        for (let i = 0; i < rgbaData.length / 4; i += 4) {
            let R = rgbaData[i];
            let G = rgbaData[i + 1];
            let B = rgbaData[i + 2];
            let luminosity = that.luminosity(R, G, B);
            averageLuminosity += luminosity;
        }
        // console.log(averageLuminosity);
        averageLuminosity = averageLuminosity / (rgbaData.length / 4) / 50 * 2;
        averageLuminosity = Math.min(averageLuminosity, 2);
        // console.log(averageLuminosity);
        return averageLuminosity;
    }
    luminosity(r, g, b) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    addTryOnButtons(mindarThree) {
        let that = this;
        const tryOnModels = this.tryOnService.getTryOnModels();
        for (const tryOnModel of tryOnModels) {
            const imgElement = this.addImgButtonToView(tryOnModel);
            imgElement.addEventListener("click", async () => {
                if (tryOnModel.loaded == undefined) {
                    tryOnModel.loaded = await this.loadTryOnModel(tryOnModel, mindarThree);
                }
                tryOnModel.visible = !tryOnModel.visible;
                if (!tryOnModel.visible) {
                    this.removeTryOnModel(tryOnModel, that, mindarThree);
                }
                this.setModelsVisible(tryOnModel.loaded, tryOnModel.visible);
                this.buttonClassSelected(imgElement, tryOnModel.visible);
            });
        }
    }
    addImgButtonToView(tryOnModel) {
        let that = this;
        const imgElement = document.createElement("img");
        imgElement.id = tryOnModel.buttonId;
        imgElement.src = tryOnModel.buttonImagePath;
        that.controls.selections().appendChild(imgElement);
        return imgElement;
    }
    removeTryOnModel(tryOnModel, that, mindarThree) {
        for (let i = 0; i < tryOnModel.loaded.length; i++) {
            const model = tryOnModel.loaded[i];
            that.removeGltfModel(model.scene, mindarThree);
            this.guiHelper.removeFolderByName(tryOnModel.buttonId + i);
        }
        tryOnModel.loaded = undefined;
    }
    removeGltfModel(gltfModel, mindarThree) {
        if (gltfModel) {
            gltfModel.traverse(function (child) {
                if (child.isMesh) {
                    child.geometry.dispose(); // Dispose geometry
                    child.material.dispose(); // Dispose material
                    // If the material has textures, dispose them too
                    if (child.material.map) {
                        child.material.map.dispose();
                    }
                }
            });
            // mindarThree.scene.remove(gltfModel);
            gltfModel.removeFromParent();
        }
    }
    async loadTryOnModel(tryOnModel, mindarThree) {
        const loadedModels = [];
        for (let i = 0; i < tryOnModel.elements.length; i++) {
            const element = tryOnModel.elements[i];
            const loaded = await loadGLTF(element.path);
            loaded.scene.rotation.set(element.rotation[0], element.rotation[1], element.rotation[2]);
            loaded.scene.position.set(element.position[0], element.position[1], element.position[2]);
            loaded.scene.scale.set(element.scale[0], element.scale[1], element.scale[2]);
            // loaded.scene.environment = background;
            const anchor = mindarThree.addAnchor(element.anchor);
            anchor.group.add(loaded.scene);
            loadedModels.push(loaded);
            this.guiHelper.addModelToGui(tryOnModel.buttonId + i, loaded.scene);
        }
        return loadedModels;
    }
    buttonClassSelected(button, visible) {
        if (visible) {
            button.classList.add("selected");
        }
        else {
            button.classList.remove("selected");
        }
    }
    setModelsVisible(models, visible) {
        if (models) {
            models.forEach((model) => {
                model.scene.visible = visible;
            });
        }
    }
    stringifySafe(obj) {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    // Circular reference found, replace with placeholder
                    return "[Circular]";
                }
                seen.add(value);
            }
            return value;
        });
    }
    initPreviewShare(mindarThree) {
        const previewImage = document.querySelector("#preview-image");
        const previewClose = document.querySelector("#preview-close");
        const preview = document.querySelector("#preview");
        const previewShare = document.querySelector("#preview-share");
        document.querySelector("#capture")?.addEventListener("click", () => {
            // this.calculateLightIntensity(mindarThree);
            const data = this.capture(mindarThree);
            preview.style.visibility = "visible";
            previewImage.src = data;
        });
        previewClose.addEventListener("click", () => {
            preview.style.visibility = "hidden";
        });
        previewShare.addEventListener("click", () => {
            const canvas = document.createElement("canvas");
            canvas.width = previewImage.width;
            canvas.height = previewImage.height;
            const context = canvas.getContext("2d");
            context?.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                const file = new File([blob], "Virtual Try On Photo.png", {
                    type: "image/png",
                });
                const files = [file];
                if (navigator.canShare && navigator.canShare({ files })) {
                    navigator.share({
                        files: files,
                        title: "AR Virtual Try On Photo",
                    });
                }
                else {
                    const link = document.createElement("a");
                    link.download = "Virtual Try On Photo.png";
                    link.href = previewImage.src;
                    link.click();
                }
            });
        });
    }
    async addOccluder(mindarThree) {
        const occluder = await loadGLTF("../../../assets/models/sparkar-occluder/headOccluder.glb");
        occluder.scene.scale.set(0.065, 0.065, 0.065);
        occluder.scene.position.set(0, -0.3, 0.15);
        occluder.scene.traverse((o) => {
            if (o.isMesh) {
                const occluderMaterial = new THREE.MeshPhongMaterial({
                    colorWrite: false,
                });
                o.material = occluderMaterial;
            }
        });
        occluder.scene.renderOrder = 0;
        const occluderAnchor = mindarThree.addAnchor(168);
        occluderAnchor.group.add(occluder.scene);
        return occluder;
    }
    async addBackgroundToScene(scene) {
        const background = await loadRGBE("../../../assets/models/Environment/thatch_chapel_4k.hdr");
        background.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = background;
        return background;
    }
    addHemisphereLight(scene) {
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        const helper = new THREE.HemisphereLightHelper(light, 20);
        scene.add(helper);
        return light;
    }
    addDirectionalLight(scene) {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 300, 300);
        scene.add(light);
        const helper = new THREE.DirectionalLightHelper(light, 20);
        return { light, helper };
    }
    addPointLight(scene) {
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(0, 0, 1000);
        scene.add(pointLight);
        const sphereSize = 20;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        scene.add(pointLightHelper);
        return pointLight;
    }
}
export const appRun = new AppRun();
//# sourceMappingURL=main.js.map