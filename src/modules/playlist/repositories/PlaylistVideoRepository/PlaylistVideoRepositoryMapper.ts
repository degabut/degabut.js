import { PlaylistVideo } from "../../entities/PlaylistVideo";
import { PlaylistVideoModel, PlaylistVideoModelProps } from "./PlaylistVideoModel";

export class PlaylistVideoRepositoryMapper {
	public static toRepository(entity: PlaylistVideo): PlaylistVideoModelProps {
		const props: PlaylistVideoModelProps = {
			id: entity.id,
			playlist_id: entity.playlistId,
			video_id: entity.videoId,
			created_at: entity.createdAt,
			created_by: entity.createdBy,
		};

		return props;
	}

	public static toDomainEntity(props: PlaylistVideoModel): PlaylistVideo {
		const entity = new PlaylistVideo({
			id: props.id,
			playlistId: props.playlist_id,
			videoId: props.video_id,
			createdBy: props.created_by,
			createdAt: new Date(props.created_at),
		});

		return entity;
	}
}
