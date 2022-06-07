import { BadRequestError, IUseCaseContext, UseCase } from "@core";
import { PlaylistDto } from "@modules/playlist/dto/PlaylistDto";
import { Playlist } from "@modules/playlist/entities/Playlist";
import { PlaylistRepository } from "@modules/playlist/repositories/PlaylistRepository/PlaylistRepository";
import { inject, injectable } from "tsyringe";
import { CreatePlaylistParams } from "./CreatePlaylistAdapter";

export type CreatePlaylistResponse = PlaylistDto;

@injectable()
export class CreatePlaylistUseCase extends UseCase<CreatePlaylistParams, CreatePlaylistResponse> {
	constructor(@inject(PlaylistRepository) private playlistRepository: PlaylistRepository) {
		super();
	}

	public async run(
		params: CreatePlaylistParams,
		{ userId }: IUseCaseContext
	): Promise<CreatePlaylistResponse> {
		const { name } = params;

		const count = await this.playlistRepository.getCountByUserId(userId);
		if (count > 25) throw new BadRequestError("Playlist limit reached");

		let playlist = new Playlist({
			name,
			ownerId: userId,
		});

		playlist = await this.playlistRepository.insert(playlist);

		return PlaylistDto.create(playlist);
	}
}
