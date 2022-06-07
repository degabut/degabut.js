import { Playlist } from "../../entities/Playlist";
import { PlaylistModel, PlaylistModelProps } from "./PlaylistModel";

export class PlaylistRepositoryMapper {
	public static toRepository(entity: Playlist): PlaylistModelProps {
		const props: PlaylistModelProps = {
			id: entity.id,
			name: entity.name,
			owner_id: entity.ownerId,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		};

		return props;
	}

	public static toDomainEntity(props: PlaylistModel): Playlist {
		const entity = new Playlist({
			id: props.id,
			name: props.name,
			ownerId: props.owner_id,
			createdAt: new Date(props.created_at),
			updatedAt: new Date(props.updated_at),
		});

		return entity;
	}
}
