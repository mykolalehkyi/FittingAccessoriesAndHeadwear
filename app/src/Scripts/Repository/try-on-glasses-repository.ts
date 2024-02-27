import { TryOnModel } from "../Models/try-on-model";

export class TryOnGlassesRepository{
	private glasses: TryOnModel[] = [
		{
			buttonId: "glasses1",
			buttonImagePath:"../../../assets/models/LoftGlasses/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/LoftGlasses/scene.gltf",
					scale:[0.18,0.18,0.18],
					position:[0,-0.25,0],
					rotation:[0,0,0],
					anchor:168,
				}
			]
		},
		{
			buttonId: "glasses2",
			buttonImagePath:"../../../assets/models/RoundGlasses/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/RoundGlasses/scene.gltf",
					scale:[0.15,0.15,0.15],
					position:[-0.3,0,0],
					rotation:[0, -Math.PI/4, 0],
					anchor:168,
				}
			]
		},
		{
			buttonId: "glasses3",
			buttonImagePath:"../../../assets/models/apple_ar_glasses_concept_art/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/apple_ar_glasses_concept_art/scene.gltf",
					scale:[0.1,0.1,0.1],
					position:[0,0,0],
					rotation:[0, 0, 0],
					anchor:168,
				}
			]
		},
	];

	public getModels(){
		return this.glasses;
	}
}