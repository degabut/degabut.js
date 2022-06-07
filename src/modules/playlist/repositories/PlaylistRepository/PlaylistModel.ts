import { Model } from "objection";

export type PlaylistModelProps = {
	id: string;
	name: string;
	owner_id: string;
	created_at: Date;
	updated_at: Date;
};

export class PlaylistModel extends Model implements PlaylistModelProps {
	id!: string;
	name!: string;
	owner_id!: string;
	created_at!: Date;
	updated_at!: Date;

	static tableName = "playlist";
}
