export class TryOnEarringsRepository {
    constructor() {
        this.earrings = [
            {
                buttonId: "#earring1",
                visible: true,
                elements: [
                    {
                        path: "../../../assets/models/oval_shape_meenakari_jaipuri_bali_earrings/scene.gltf",
                        scale: [1.6, 1.6, 1.6],
                        position: [-0.1, -0.3, 0],
                        rotation: [0, Math.PI / 2, 0],
                        anchor: 127,
                    },
                    {
                        path: "../../../assets/models/oval_shape_meenakari_jaipuri_bali_earrings/scene.gltf",
                        scale: [1.6, 1.6, 1.6],
                        position: [-0.05, -0.3, 0],
                        rotation: [0, Math.PI / 2, 0],
                        anchor: 356,
                    },
                ]
            },
            {
                buttonId: "#earring2",
                visible: false,
                elements: [
                    {
                        path: "../../../assets/models/louboutin_earring/scene.gltf",
                        scale: [5, 5, 5],
                        position: [0, -0.5, -0.15],
                        rotation: [0, 0, 0],
                        anchor: 127,
                    },
                    {
                        path: "../../../assets/models/louboutin_earring/scene.gltf",
                        scale: [5, 5, 5],
                        position: [0, -0.5, -0.15],
                        rotation: [0, 0, 0],
                        anchor: 356,
                    },
                ]
            },
            {
                buttonId: "#earring3",
                visible: false,
                elements: [
                    {
                        path: "../../../assets/models/ChinaEarring/scene.gltf",
                        scale: [0.15, 0.15, 0.15],
                        position: [0, -0.2, -0.1],
                        rotation: [0, 0, 0],
                        anchor: 127,
                    },
                    {
                        path: "../../../assets/models/ChinaEarring/scene.gltf",
                        scale: [0.15, 0.15, 0.15],
                        position: [0, -0.2, -0.1],
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