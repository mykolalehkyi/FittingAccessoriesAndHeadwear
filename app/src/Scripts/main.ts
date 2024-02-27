import { loadGLTF, loadRGBE, loadTexture } from "../../../libs/loader.js";
import { mockWithVideo } from "../../../libs/camera-mock.js";
import * as THREEts from "three";
import { TryOnService } from "./Services/try-on-service.js";
import { MindARThree } from "./Models/mind-ar-three-model.js";
import { GuiHelper } from "./Helper/gui-helper.js";
import { StatsHelper } from "./Helper/stats-helper.js";
import { GltfLoaded } from "./Models/gltf-loaded-model.js";
import { TryOnModel } from "./Models/try-on-model.js";
export const THREE = (<any>window).MINDAR.FACE.THREE;

class AppRun {
  private tryOnService: TryOnService = new TryOnService();
  private guiHelper: GuiHelper = new GuiHelper();
  private statsHelper: StatsHelper = new StatsHelper();

  private controls = {
    selections: () => document.querySelector("#selections"),
  };

  constructor() {
    this.init();
  }

  private capture(mindarThree: MindARThree) {
    const { video, renderer, scene, camera }: MindARThree = mindarThree;
    const renderCanvas = renderer.domElement;

    // Output canvas
    const canvas = document.createElement("canvas");
    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    canvas.width = renderCanvas.width;
    canvas.height = renderCanvas.height;

    const sx =
      (((video.clientWidth - renderCanvas.clientWidth) / 2) *
        video.videoWidth) /
      video.clientWidth;
    const sy =
      (((video.clientHeight - renderCanvas.clientHeight) / 2) *
        video.videoHeight) /
      video.clientHeight;
    const sw = video.videoWidth - sx * 2;
    const sh = video.videoHeight - sy * 2;

    context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    (<any>renderer).preserveDrawingBuffer = true;
    renderer.render(scene, camera); // empty if not run
    context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
    (<any>renderer).preserveDrawingBuffer = false;

    const data = canvas.toDataURL("image/png");
    return data;
  }

  private init() {
    document.addEventListener("DOMContentLoaded", () => {
      const start = async () => {
        // mockWithVideo('../../../assets/mock-videos/face2.mp4');

        const mindarThree: MindARThree = new (<any>(
          window
        )).MINDAR.FACE.MindARThree({
          container: document.body,
        });
        const { renderer, scene, camera } = mindarThree;

        this.guiHelper.addGui();

        let occluder = await this.addOccluder(mindarThree);

        // //Adding light
        // const pointLight: THREEts.PointLight = this.addPointLight(scene);
        // this.guiHelper.addPointLightToGui(pointLight);

        const directionalLight = this.addDirectionalLight(scene);
        this.guiHelper.addDirectionalLightToGui(directionalLight.light);
        directionalLight.light.target = occluder.scene;

        // const hemisphereLight: THREEts.HemisphereLight =
        //   this.addHemisphereLight(scene);
        // this.guiHelper.addHemisphereLightToGui(hemisphereLight);

        const background: THREEts.DataTexture = await this.addBackgroundToScene(
          scene
        );

        this.addTryOnButtons(mindarThree);

        this.initPreviewShare(mindarThree);

        this.statsHelper.addStatsFPS();
        this.statsHelper.addStatsMB();
        this.statsHelper.addStatsMS();

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
          this.statsHelper.getStatsFPS().update();
          this.statsHelper.getStatsMB().update();
          this.statsHelper.getStatsMS().update();
          directionalLight.helper.update();
        });
      };
      start();
    });
  }

  private addTryOnButtons(mindarThree: MindARThree) {
    let that = this;
    const tryOnModels: TryOnModel[] = this.tryOnService.getTryOnModels();

    for (const tryOnModel of tryOnModels) {
      const imgElement = this.addImgButtonToView(tryOnModel);
      imgElement.addEventListener("click", async () => {
        if (tryOnModel.loaded == undefined) {
          tryOnModel.loaded = await this.loadTryOnModel(
            tryOnModel,
            mindarThree
          );
        }

        tryOnModel.visible = !tryOnModel.visible;
        if (!tryOnModel.visible) {
          this.removeTryOnModel(tryOnModel, that, mindarThree);
        }

        this.buttonClassSelected(
          imgElement,
          tryOnModel.loaded,
          tryOnModel.visible
        );
      });
    }
  }

  private addImgButtonToView(tryOnModel: TryOnModel) {
    let that = this;
    const imgElement = document.createElement("img");
    imgElement.id = tryOnModel.buttonId;
    imgElement.src = tryOnModel.buttonImagePath;
    that.controls.selections().appendChild(imgElement);
    return imgElement;
  }

  private removeTryOnModel(
    tryOnModel: TryOnModel,
    that: this,
    mindarThree: MindARThree
  ) {
    for (let i = 0; i < tryOnModel.loaded.length; i++) {
      const model = tryOnModel.loaded[i];
      that.removeGltfModel(model.scene, mindarThree);
      this.guiHelper.removeFolderByName(tryOnModel.buttonId + i);
    }
    tryOnModel.loaded = undefined;
  }

  private removeGltfModel(gltfModel: THREEts.Group, mindarThree: MindARThree) {
    if (gltfModel) {
		gltfModel.traverse(function(child:any) {
			if (child.isMesh) {
                child.geometry.dispose(); // Dispose geometry
                child.material.dispose(); // Dispose material

                // If the material has textures, dispose them too
                if (child.material.map) {
                    child.material.map.dispose();
                }
		});

      // mindarThree.scene.remove(gltfModel);
      gltfModel.removeFromParent();
    }
  }

  private async loadTryOnModel(
    tryOnModel: TryOnModel,
    mindarThree: MindARThree
  ) {
    const loadedModels: GltfLoaded[] = [];
    for (let i = 0; i < tryOnModel.elements.length; i++) {
      const element = tryOnModel.elements[i];
      const loaded: GltfLoaded = await loadGLTF(element.path);
      loaded.scene.rotation.set(
        element.rotation[0],
        element.rotation[1],
        element.rotation[2]
      );
      loaded.scene.position.set(
        element.position[0],
        element.position[1],
        element.position[2]
      );
      loaded.scene.scale.set(
        element.scale[0],
        element.scale[1],
        element.scale[2]
      );
      // loaded.scene.environment = background;
      const anchor: any = mindarThree.addAnchor(element.anchor);
      anchor.group.add(loaded.scene);

      loadedModels.push(loaded);

      this.guiHelper.addModelToGui(tryOnModel.buttonId + i, loaded.scene);
    }
    return loadedModels;
  }

  private buttonClassSelected(button, models: GltfLoaded[], visible: boolean) {
    if (visible) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
    if (models) {
      models.forEach((model) => {
        model.scene.visible = visible;
      });
    }
  }

  private stringifySafe(obj: any):string {
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

  private initPreviewShare(mindarThree: MindARThree) {
    const previewImage: any = document.querySelector("#preview-image");
    const previewClose: any = document.querySelector("#preview-close");
    const preview: any = document.querySelector("#preview");
    const previewShare: any = document.querySelector("#preview-share");

    document.querySelector("#capture")?.addEventListener("click", () => {
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
        const file = new File([<any>blob], "Virtual Try On Photo.png", {
          type: "image/png",
        });
        const files = [file];
        if (navigator.canShare && navigator.canShare({ files })) {
          navigator.share({
            files: files,
            title: "AR Virtual Try On Photo",
          });
        } else {
          const link = document.createElement("a");
          link.download = "Virtual Try On Photo.png";
          link.href = previewImage.src;
          link.click();
        }
      });
    });
  }

  private async addOccluder(mindarThree: MindARThree) {
    const occluder: GltfLoaded = await loadGLTF(
      "../../../assets/models/sparkar-occluder/headOccluder.glb"
    );
    occluder.scene.scale.set(0.065, 0.065, 0.065);
    occluder.scene.position.set(0, -0.3, 0.15);
    occluder.scene.traverse((o:any) => {
      if (o.isMesh) {
        const occluderMaterial = new THREE.MeshPhongMaterial({
          colorWrite: false,
        });
        o.material = occluderMaterial;
      }
    });
    occluder.scene.renderOrder = 0;

    const occluderAnchor: any = mindarThree.addAnchor(168);
    occluderAnchor.group.add(occluder.scene);
    return occluder;
  }

  private async addBackgroundToScene(scene: THREEts.Scene) {
    const background: THREEts.DataTexture = await loadRGBE(
      "../../../assets/models/Environment/thatch_chapel_4k.hdr"
    );
    background.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = background;
    return background;
  }

  private addHemisphereLight(scene: THREEts.Scene) {
    const light: THREEts.HemisphereLight = new THREE.HemisphereLight(
      0xffffff,
      0xbbbbff,
      1
    );
    scene.add(light);
    const helper: THREEts.HemisphereLightHelper =
      new THREE.HemisphereLightHelper(light, 20);
    scene.add(helper);
    return light;
  }

  private addDirectionalLight(scene: THREEts.Scene) {
    const light: THREEts.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      1
    );
    light.position.set(0, 300, 300);
    scene.add(light);
    const helper: THREEts.DirectionalLightHelper =
      new THREE.DirectionalLightHelper(light, 20);
    scene.add(helper);
    return { light, helper };
  }

  private addPointLight(scene: THREEts.Scene) {
    const pointLight: THREEts.PointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 1000);
    scene.add(pointLight);
    const sphereSize = 20;
    const pointLightHelper: THREEts.PointLightHelper =
      new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);
    return pointLight;
  }
}

export const appRun = new AppRun();
