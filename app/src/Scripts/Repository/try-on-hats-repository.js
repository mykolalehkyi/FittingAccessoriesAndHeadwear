export class TryOnHatsRepository {
    constructor() {
        this.hats = [
            {
                buttonId: "hat1",
                buttonImagePath: "../../../assets/models/CouboyHat/thumbnail.png",
                visible: false,
                loaded: undefined,
                elements: [
                    {
                        path: "../../../assets/models/CouboyHat/scene.gltf",
                        scale: [0.05, 0.05, 0.05],
                        position: [0, 0.55, 0],
                        rotation: [0, 0, 0],
                        anchor: 10,
                    }
                ]
            },
            {
                buttonId: "hat2",
                buttonImagePath: "../../../assets/models/PixelSantaHat/thumbnail.png",
                visible: false,
                loaded: undefined,
                elements: [
                    {
                        path: "../../../assets/models/PixelSantaHat/scene.gltf",
                        scale: [1.2, 1.2, 1.2],
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        anchor: 10,
                    }
                ]
            },
            {
                buttonId: "hat3",
                buttonImagePath: "../../../assets/models/SailorHat/thumbnail.png",
                visible: false,
                loaded: undefined,
                elements: [
                    {
                        path: "../../../assets/models/SailorHat/scene.gltf",
                        scale: [2.8, 2.8, 2.8],
                        position: [0, 0, -0.7],
                        rotation: [0, 0, 0],
                        anchor: 10,
                    }
                ]
            },
        ];
    }
    getModels() {
        return this.hats;
    }
}
//# sourceMappingURL=try-on-hats-repository.js.map