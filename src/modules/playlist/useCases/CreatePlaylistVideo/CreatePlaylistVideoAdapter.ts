import { UseCaseAdapter } from "@core";
import Joi from "joi";

export type CreatePlaylistVideoParams = {
	playlistId: string;
	videoId: string;
};

export class CreatePlaylistVideoAdapter extends UseCaseAdapter<CreatePlaylistVideoParams> {
	constructor(params: Partial<CreatePlaylistVideoParams>) {
		super(params);
	}

	static SCHEMA = Joi.object<CreatePlaylistVideoParams>({
		playlistId: Joi.string().uuid().required(),
		videoId: Joi.string().required().length(11),
	});
}
