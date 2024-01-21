import { TryOnEarringsRepository } from "../Repository/try-on-earrings-repository.js";
import { TryOnGlassesRepository } from "../Repository/try-on-glasses-repository.js";
import { TryOnHatsRepository } from "../Repository/try-on-hats-repository.js";
export class TryOnService {
    constructor() {
        this.tryOnEarringsRepository = new TryOnEarringsRepository();
        this.tryOnGlassesRepository = new TryOnGlassesRepository();
        this.tryOnHatsRepository = new TryOnHatsRepository();
    }
    getTryOnModels() {
        const models = [...this.tryOnHatsRepository.getModels(), ...this.tryOnGlassesRepository.getModels(), ...this.tryOnEarringsRepository.getModels()];
        return models;
    }
}
//# sourceMappingURL=try-on-service.js.map