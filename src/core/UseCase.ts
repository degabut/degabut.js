import Joi from "joi";
import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { EventHandler } from "./EventHandler";
import { UseCaseAdapter } from "./UseCaseAdapter";

export type IUseCaseContext = {
	userId: string;
};

const contextSchema = Joi.object({
	userId: Joi.string().required(),
});

abstract class UseCase<ParamsSchema = unknown, Response = unknown> {
	protected abstract run(params: ParamsSchema, context?: IUseCaseContext): Promise<Response>;

	public async execute(
		params: UseCaseAdapter<ParamsSchema>,
		context?: IUseCaseContext
	): Promise<Response> {
		const validatedParams = await this.validate(params, context);
		const response = await this.run(validatedParams, context);

		return response;
	}

	protected async emit<T extends EventHandler>(
		event: constructor<T>,
		data: Parameters<T["run"]>[0]
	): Promise<void> {
		const eventHandler = container.resolve(event); // TODO better resolve
		await eventHandler.run(data);
	}

	private async validate(
		params: Partial<UseCaseAdapter<ParamsSchema>>,
		context?: IUseCaseContext
	): Promise<ParamsSchema> {
		if (context) await contextSchema.validateAsync(context);
		const result = await params.validate?.();
		if (!result) throw new Error("Couldn't validate adapter");
		return result;
	}
}

export { UseCase };
