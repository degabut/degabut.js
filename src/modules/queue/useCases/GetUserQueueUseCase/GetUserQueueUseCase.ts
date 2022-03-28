import { UseCase } from "@core";
import { IQueueRepository } from "@modules/queue";
import Joi from "joi";
import { QueueDto } from "modules/queue/dto";
import { inject, injectable } from "tsyringe";

interface Params {
	userId: string;
}

type Response = QueueDto | undefined;

@injectable()
export class GetUserQueueUseCase extends UseCase<Params, Response> {
	public paramsSchema = Joi.object<Params>({
		userId: Joi.string().required(),
	}).required();

	constructor(@inject("QueueRepository") private queueRepository: IQueueRepository) {
		super();
	}

	public async run(params: Params): Promise<Response> {
		const { userId } = params;

		const queue = this.queueRepository.getByUserId(userId);

		return queue ? QueueDto.create(queue) : undefined;
	}
}
