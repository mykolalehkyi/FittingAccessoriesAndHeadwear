import { GltfLoaded } from "./gltf-loaded-model";
import { TryOnElementModel } from "./try-on-element-model";

export class TryOnModel{
	public buttonId: string;
	public visible: boolean;
	public elements: TryOnElementModel[];
	public buttonImagePath:string;
	public loaded:GltfLoaded[] | undefined = undefined;
}