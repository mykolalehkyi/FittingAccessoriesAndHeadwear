import { TryOnEarringsRepository } from "../Repository/try-on-earrings-repository.js";
import { TryOnGlassesRepository } from "../Repository/try-on-glasses-repository.js";
import { TryOnHatsRepository } from "../Repository/try-on-hats-repository.js";

export class TryOnService{
	private tryOnEarringsRepository:TryOnEarringsRepository = new TryOnEarringsRepository();
	private tryOnGlassesRepository:TryOnGlassesRepository = new TryOnGlassesRepository();
	private tryOnHatsRepository:TryOnHatsRepository = new TryOnHatsRepository();

	public getTryOnModels():TryOnModel[]{
		const models = [...this.tryOnHatsRepository.getModels(), ...this.tryOnGlassesRepository.getModels(), ...this.tryOnEarringsRepository.getModels()];
		return models;
	}
}