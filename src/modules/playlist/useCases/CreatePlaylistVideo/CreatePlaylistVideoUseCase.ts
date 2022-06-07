import { BadRequestError, ForbiddenError, IUseCaseContext, UseCase } from "@core";
import { PlaylistVideo } from "@modules/playlist/entities/PlaylistVideo";
import { PlaylistRepository } from "@modules/playlist/repositories/PlaylistRepository/PlaylistRepository";
import { PlaylistVideoRepository } from "@modules/playlist/repositories/PlaylistVideoRepository/PlaylistVideoRepository";
import { inject, injectable } from "tsyringe";
import { CreatePlaylistVideoParams } from "./CreatePlaylistVideoAdapter";

export type CreatePlaylistVideoResponse = null;

@injectable()
export class CreatePlaylistVideoUseCase extends UseCase<
	CreatePlaylistVideoParams,
	CreatePlaylistVideoResponse
> {
	constructor(
		@inject(PlaylistRepository) private playlistRepository: PlaylistRepository,
		@inject(PlaylistVideoRepository) private playlistVideoRepository: PlaylistVideoRepository
	) {
		super();
	}

	public async run(
		params: CreatePlaylistVideoParams,
		{ userId }: IUseCaseContext
	): Promise<CreatePlaylistVideoResponse> {
		const { videoId, playlistId } = params;

		const playlist = await this.playlistRepository.getById(playlistId);
		if (playlist?.ownerId !== userId) throw new ForbiddenError("No permission");

		const count = await this.playlistVideoRepository.getCountByPlaylistId(playlistId);
		if (count > 200) throw new BadRequestError("Playlist video limit reached");

		const playlistVideo = new PlaylistVideo({
			videoId,
			playlistId,
			createdBy: userId,
		});
		await this.playlistVideoRepository.insert(playlistVideo);

		return null;
	}
}
