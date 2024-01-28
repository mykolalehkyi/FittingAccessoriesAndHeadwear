export class TryOnGlassesRepository {
    constructor() {
        this.glasses = [
            {
                buttonId: "#glasses1",
                visible: true,
                elements: [
                    {
                        path: "../../../assets/models/LoftGlasses/scene.gltf",
                        scale: [0.18, 0.18, 0.18],
                        position: [0, -0.25, 0],
                        rotation: [0, 0, 0],
                        anchor: 168,
                    }
                ]
            },
            {
                buttonId: "#glasses2",
                visible: false,
                elements: [
                    {
                        path: "../../../assets/models/RoundGlasses/scene.gltf",
                        scale: [0.15, 0.15, 0.15],
                        position: [-0.3, 0, 0],
                        rotation: [0, -Math.PI / 4, 0],
                        anchor: 168,
                    }
                ]
            },
            {
                buttonId: "#glasses3",
                visible: false,
                elements: [
                    {
                        path: "../../../assets/models/apple_ar_glasses_concept_art/scene.gltf",
                        scale: [0.1, 0.1, 0.1],
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        anchor: 168,
                    }
                ]
            },
        ];
    }
    getModels() {
        return this.glasses;
    }
}
//# sourceMappingURL=try-on-glasses-repository.js.map