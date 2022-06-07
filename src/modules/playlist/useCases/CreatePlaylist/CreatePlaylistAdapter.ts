import { UseCaseAdapter } from "@core";
import Joi from "joi";

export type CreatePlaylistParams = {
	name: string;
};

export class CreatePlaylistAdapter extends UseCaseAdapter<CreatePlaylistParams> {
	constructor(params: Partial<CreatePlaylistParams>) {
		super(params);
	}

	static SCHEMA = Joi.object<CreatePlaylistParams>({
		name: Joi.string().required().min(1).max(128),
	});
}
