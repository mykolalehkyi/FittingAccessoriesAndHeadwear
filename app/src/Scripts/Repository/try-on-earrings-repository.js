export class TryOnEarringsRepository {
    constructor() {
        this.earrings = [
            {
                buttonId: "#earring",
                visible: true,
                elements: [
                    {
                        path: "../../../assets/models/earring/scene.gltf",
                        scale: [0.05, 0.05, 0.05],
                        position: [0, -0.3, -0.3],
                        rotation: [0, 0, 0],
                        anchor: 127,
                    },
                    {
                        path: "../../../assets/models/earring/scene.gltf",
                        scale: [0.05, 0.05, 0.05],
                        position: [0, -0.3, -0.3],
                        rotation: [0, 0, 0],
                        anchor: 356,
                    },
                ]
            },
        ];
    }
    getModels() {
        return this.earrings;
    }
}
//# sourceMappingURL=try-on-earrings-repository.js.map