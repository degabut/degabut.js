import { v4 } from "uuid";

interface ConstructorProps {
	id?: string;
	playlistId: string;
	videoId: string;
	createdBy: string;
	createdAt?: Date;
}

export class PlaylistVideo {
	public readonly id: string;
	public readonly playlistId: string;
	public readonly videoId: string;
	public readonly createdBy: string;
	public readonly createdAt: Date;

	constructor(props: ConstructorProps) {
		this.id = props.id || v4();
		this.playlistId = props.playlistId;
		this.videoId = props.videoId;
		this.createdBy = props.createdBy;
		this.createdAt = props.createdAt || new Date();
	}
}
