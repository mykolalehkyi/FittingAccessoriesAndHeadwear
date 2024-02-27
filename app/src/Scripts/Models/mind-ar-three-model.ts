import * as THREEts from "three";

export interface MindARThree {
	addAnchor(arg0: number): unknown;
	start(): unknown;
	video: any;
	renderer: THREEts.WebGL1Renderer;
	scene: THREEts.Scene;
	camera: THREEts.PerspectiveCamera;
}