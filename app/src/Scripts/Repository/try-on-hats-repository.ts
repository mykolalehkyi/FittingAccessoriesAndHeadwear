import { TryOnModel } from "../Models/try-on-model";

export class TryOnHatsRepository{
	private hats: TryOnModel[] = [
		{
			buttonId: "hat1",
			buttonImagePath:"../../../assets/models/CouboyHat/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/CouboyHat/scene.gltf",
					scale:[0.05, 0.05, 0.05],
					position:[0, 0.55, 0],
					rotation:[0,0,0],
					anchor:10,
				}
			]
		},
		{
			buttonId: "hat2",
			buttonImagePath:"../../../assets/models/PixelSantaHat/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/PixelSantaHat/scene.gltf",
					scale:[1.2, 1.2, 1.2],
					position:[0, 0, 0],
					rotation:[0,0,0],
					anchor:10,
				}
			]
		},
		{
			buttonId: "hat3",
			buttonImagePath:"../../../assets/models/SailorHat/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/SailorHat/scene.gltf",
					scale:[2.8, 2.8, 2.8],
					position:[0, 0, -0.7],
					rotation:[0,0,0],
					anchor:10,
				}
			]
		},
	];

	public getModels(){
		return this.hats;
	}
}