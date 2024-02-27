import { TryOnModel } from "../Models/try-on-model";

export class TryOnEarringsRepository{
	private earrings: TryOnModel[] = [
		{
			buttonId: "earring1",
			buttonImagePath:"../../../assets/models/oval_shape_meenakari_jaipuri_bali_earrings/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/oval_shape_meenakari_jaipuri_bali_earrings/scene.gltf",
					scale:[1.6, 1.6, 1.6],
					position:[-0.1, -0.3, 0],
					rotation:[0,Math.PI/2,0],
					anchor:127,
				},
				{
					path: "../../../assets/models/oval_shape_meenakari_jaipuri_bali_earrings/scene.gltf",
					scale:[1.6, 1.6, 1.6],
					position:[-0.05, -0.3, 0],
					rotation:[0,Math.PI/2,0],
					anchor:356,
				},
			]
		},
		{
			buttonId: "earring2",
			buttonImagePath:"../../../assets/models/louboutin_earring/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/louboutin_earring/scene.gltf",
					scale:[5, 5, 5],
					position:[0, -0.5, -0.15],
					rotation:[0,0,0],
					anchor:127,
				},
				{
					path: "../../../assets/models/louboutin_earring/scene.gltf",
					scale:[5, 5, 5],
					position:[0, -0.5, -0.15],
					rotation:[0,0,0],
					anchor:356,
				},
			]
		},
		{
			buttonId: "earring3",
			buttonImagePath:"../../../assets/models/ChinaEarring/thumbnail.png",
			visible: false,
			loaded:undefined,
			elements:[
				{
					path: "../../../assets/models/ChinaEarring/scene.gltf",
					scale:[0.15, 0.15, 0.15],
					position:[0, -0.2, -0.1],
					rotation:[0,0,0],
					anchor:127,
				},
				{
					path: "../../../assets/models/ChinaEarring/scene.gltf",
					scale:[0.15, 0.15, 0.15],
					position:[0, -0.2, -0.1],
					rotation:[0,0,0],
					anchor:356,
				},
			]
		},
	];

	public getModels(){
		return this.earrings;
	}
}