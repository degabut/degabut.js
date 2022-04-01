import { IUseCaseContext, UseCase } from "@core";
import { IQueueRepository } from "@modules/queue/repository/IQueueRepository";
import { inject, injectable } from "tsyringe";
import { DisconnectParams } from "./DisconnectAdapter";

type Response = void;

@injectable()
export class DisconnectUseCase extends UseCase<DisconnectParams, Response> {
	constructor(@inject("QueueRepository") private queueRepository: IQueueRepository) {
		super();
	}

	public async run(params: DisconnectParams, { userId }: IUseCaseContext): Promise<Response> {
		const { guildId } = params;

		const queue = this.queueRepository.get(guildId);
		if (!queue) throw new Error("Queue not found");
		if (!queue.voiceChannel.members.find((m) => m.id === userId)) {
			throw new Error("User not in voice channel");
		}

		queue.stop();
		this.queueRepository.delete(guildId);
	}
}
