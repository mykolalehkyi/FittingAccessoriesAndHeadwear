import * as THREEts from "three";
import {GLTFParser} from "../../../../libs/three.js-r132/examples/js/loaders/GLTFLoader.js";

export class GltfLoaded {
	scene: THREEts.Group;
	scenes: THREEts.Group[];
	animations: THREEts.AnimationClip[];
	cameras: any[];
	asset: any;
	parser: GLTFParser;
	userData: any
}