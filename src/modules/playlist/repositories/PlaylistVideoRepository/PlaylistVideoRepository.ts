import { PlaylistVideo } from "@modules/playlist/entities/PlaylistVideo";
import { injectable } from "tsyringe";
import { PlaylistVideoModel } from "./PlaylistVideoModel";
import { PlaylistVideoRepositoryMapper } from "./PlaylistVideoRepositoryMapper";

@injectable()
export class PlaylistVideoRepository {
	public async insert(playlistVideo: PlaylistVideo): Promise<PlaylistVideo> {
		const props = PlaylistVideoRepositoryMapper.toRepository(playlistVideo);
		const result = await PlaylistVideoModel.query().insert(props).returning("*");
		return PlaylistVideoRepositoryMapper.toDomainEntity(result);
	}

	public async delete(playlistVideo: PlaylistVideo): Promise<boolean> {
		const result = await PlaylistVideoModel.query().deleteById(playlistVideo.id);
		return result > 0;
	}

	public async getCountByPlaylistId(playlistId: string): Promise<number> {
		const query = PlaylistVideoModel.query().where({ playlist_id: playlistId });
		return await query.resultSize();
	}
}
