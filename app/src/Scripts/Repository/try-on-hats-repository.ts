export class TryOnHatsRepository{
	private hats: TryOnModel[] = [
		{
			buttonId: "#hat1",
			visible: true,
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
			buttonId: "#hat2",
			visible: false,
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
			buttonId: "#hat3",
			visible: false,
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