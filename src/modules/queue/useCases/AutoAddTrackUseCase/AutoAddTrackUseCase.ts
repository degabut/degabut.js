import { BadRequestError, UseCase } from "@core";
import { Track } from "@modules/queue/entities/Track";
import { OnTrackAddEvent } from "@modules/queue/events/OnTrackAddEvent";
import { QueueService } from "@modules/queue/services/QueueService";
import { DIYoutubeProvider, IYoutubeProvider } from "@modules/youtube/providers/IYoutubeProvider";
import { inject, injectable } from "tsyringe";
import { AutoAddTrackParams } from "./AutoAddTrackAdapter";

type Response = void;

@injectable()
export class AutoAddTrackUseCase extends UseCase<AutoAddTrackParams, Response> {
	constructor(
		@inject(DIYoutubeProvider)
		private youtubeProvider: IYoutubeProvider,

		@inject(QueueService)
		private queueService: QueueService
	) {
		super();
	}

	public async run(params: AutoAddTrackParams): Promise<Response> {
		const { queue } = params;

		const lastSong = queue.history[0];
		if (!lastSong) throw new BadRequestError("No last song found");

		const video = await this.youtubeProvider.getVideo(lastSong.video.id);
		if (!video) return;

		const historyIds = queue.history.map((h) => h.video.id).slice(0, 10);
		const upNext = video.related.find((v) => !historyIds.includes(v.id)) || video.related[0];
		if (!upNext) return;

		const track = new Track({
			video: upNext,
			requestedBy: lastSong.requestedBy,
		});

		const isPlayedImmediately = !queue.nowPlaying;
		this.queueService.addQueueTrack(queue, track);
		this.emit(OnTrackAddEvent, { queue, track, isPlayedImmediately });
	}
}
