import { loadGLTF, loadRGBE, loadTexture } from "../../../libs/loader.js";
import { mockWithVideo } from "../../../libs/camera-mock.js";
import Stats from "../../../libs/three.js-r132/examples/jsm/libs/stats.module.js";
import { GUI } from "../../../libs/three.js-r132/examples/jsm/libs/dat.gui.module.js";
import * as THREEts from "three";
import * as GUIts from "dat.gui";
import {TryOnService} from "./Services/try-on-service.js"
const THREE = (<any>window).MINDAR.FACE.THREE;

class AppRun {
	private tryOnService: TryOnService = new TryOnService();
	private gui: GUIts.GUI;

  constructor() {
	this.init();
  }

  capture = (mindarThree) => {
    const {
      video,
      renderer,
      scene,
      camera,
    }: {
      video: any;
      renderer: THREEts.Renderer;
      scene: THREEts.Scene;
      camera: THREEts.Camera;
    } = mindarThree;
    const renderCanvas = renderer.domElement;

    // Output canvas
    const canvas = document.createElement("canvas");
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
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

    context?.drawImage(
      video,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      canvas.width,
      canvas.height
    );

    (<any>renderer).preserveDrawingBuffer = true;
    renderer.render(scene, camera); // empty if not run
    context?.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
    (<any>renderer).preserveDrawingBuffer = false;

    const data = canvas.toDataURL("image/png");
    return data;
  };

  private init() {
    document.addEventListener("DOMContentLoaded", () => {
      const start = async () => {
        //mockWithVideo('../../assets/mock-videos/face1.mp4');

        const mindarThree = new (<any>window).MINDAR.FACE.MindARThree({
          container: document.body,
        });
        const { renderer, scene, camera } = mindarThree;

        //Adding light
        const pointLight: THREEts.PointLight = this.addLightToScene(scene);
        this.gui = this.addGui(pointLight);

        await this.addBackgroundToScene(scene);

        await this.addOccluder(mindarThree);

        await this.addModelsToScene(mindarThree);

        this.initPreviewShare(mindarThree);

        const stats = this.addStats();


        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
          stats.update();
        });
      };
      start();
    });
  }

	private async addModelsToScene(mindarThree: any) {
		const tryOnModels:TryOnModel[] = this.tryOnService.getTryOnModels();

		for(const tryOnModel of tryOnModels) {
			const loadedModels: any[] = [];
			for(let i = 0; i< tryOnModel.elements.length; i++) {
				const element = tryOnModel.elements[i];
				const loaded = await loadGLTF(
					element.path
				);
				loaded.scene.rotation.set(element.rotation[0], element.rotation[1], element.rotation[2]);
				loaded.scene.position.set(element.position[0], element.position[1], element.position[2]);
				loaded.scene.scale.set(element.scale[0], element.scale[1], element.scale[2]);
				const anchor = mindarThree.addAnchor(element.anchor);
				anchor.group.add(loaded.scene);

				loadedModels.push(loaded);

				this.addModelToGui(this.gui,tryOnModel.buttonId + " " + i,loaded.scene);
			};

			const button = document.querySelector(tryOnModel.buttonId);
			this.setVisible(button, loadedModels, tryOnModel.visible);
			button.addEventListener("click", () => {
				tryOnModel.visible = !tryOnModel.visible;
				this.setVisible(button, loadedModels, tryOnModel.visible);
			});
		};
	}

	private setVisible(button, models:any[], visible:boolean) {
		if (visible) {
			button.classList.add("selected");
		} else {
			button.classList.remove("selected");
		}
		models.forEach((model) => {
			model.scene.visible = visible;
		});
	}

	private initPreviewShare(mindarThree: any) {
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

	private addStats() {
		const stats = Stats();
		document.body.appendChild(stats.dom);
		return stats;
	}

	private addGui(pointLight: THREEts.PointLight): GUIts.GUI {
		const gui: GUIts.GUI = new GUI();
		const pointLightFolder = gui.addFolder("Point Light");
		pointLightFolder.add(pointLight.position, <never>"x", -10, 1000);
		pointLightFolder.add(pointLight.position, <never>"y", -10, 1000);
		pointLightFolder.add(pointLight.position, <never>"z", -10, 1000);
		pointLightFolder.open();
		return gui;
	}

	private addModelToGui(gui: GUIts.GUI,name:string,model:any) {
		const modelFolder = gui.addFolder(name);
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
	}

	private async addOccluder(mindarThree: any) {
		const occluder = await loadGLTF(
			"../../../assets/models/sparkar-occluder/headOccluder.glb"
		);
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
	}

	private async addBackgroundToScene(scene: any) {
		const background = await loadRGBE(
			"../../../assets/models/Environment/thatch_chapel_4k.hdr"
		);
		background.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = background;
	}

	private addLightToScene(scene: any) {
		const light: THREEts.HemisphereLight = new THREE.HemisphereLight(
			0xffffff,
			0xbbbbff,
			1
		);
		const light2 = new THREE.DirectionalLight(0xffffff, 1);
		light2.position.set(-0.5, 1, 1);
		// scene.add(light);
		// scene.add(light2);
		const pointLight: THREEts.PointLight = new THREE.PointLight(
			0xffffff,
			1
		);
		pointLight.position.set(0, 0, 1000);
		scene.add(pointLight);
		const sphereSize = 4;
		const pointLightHelper: THREEts.PointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
		scene.add(pointLightHelper);
		return pointLight;
	}
}

export const appRun = new AppRun();
