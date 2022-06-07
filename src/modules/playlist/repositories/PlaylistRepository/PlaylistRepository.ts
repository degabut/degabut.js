import { Playlist } from "@modules/playlist/entities/Playlist";
import { injectable } from "tsyringe";
import { PlaylistModel } from "./PlaylistModel";
import { PlaylistRepositoryMapper } from "./PlaylistRepositoryMapper";

@injectable()
export class PlaylistRepository {
	public async insert(playlist: Playlist): Promise<Playlist> {
		const props = PlaylistRepositoryMapper.toRepository(playlist);
		const result = await PlaylistModel.query().insert(props).returning("*");
		return PlaylistRepositoryMapper.toDomainEntity(result);
	}

	public async update(playlist: Playlist): Promise<Playlist> {
		const props = PlaylistRepositoryMapper.toRepository(playlist);
		const [result] = await PlaylistModel.query()
			.update(props)
			.where("id", playlist.id)
			.returning("*");
		return PlaylistRepositoryMapper.toDomainEntity(result);
	}

	public async getById(playlistId: string): Promise<Playlist | undefined> {
		const result = await PlaylistModel.query().findById(playlistId);
		return result ? PlaylistRepositoryMapper.toDomainEntity(result) : undefined;
	}

	public async getCountByUserId(userId: string): Promise<number> {
		const query = PlaylistModel.query().where({ owner_id: userId });
		return await query.resultSize();
	}
}
