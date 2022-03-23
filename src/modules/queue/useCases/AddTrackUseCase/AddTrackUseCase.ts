import { UseCase } from "@core";
import { AutoAddTrackUseCase, IQueueRepository, Queue, Track } from "@modules/queue";
import { IYoutubeProvider, YoutubeProvider } from "@modules/youtube";
import { BaseGuildTextChannel, BaseGuildVoiceChannel, GuildMember } from "discord.js";
import Joi from "joi";
import { delay, inject, injectable } from "tsyringe";

type Params = {
	keyword: string;
	id: string;
	guildId: string;
	requestedBy: GuildMember;
	voiceChannel?: BaseGuildVoiceChannel;
	textChannel?: BaseGuildTextChannel;
};

type Response = Queue | undefined;

@injectable()
export class AddTrackUseCase extends UseCase<Params, Response> {
	public paramsSchema = Joi.object<Params>({
		keyword: Joi.string(),
		id: Joi.string(),
		guildId: Joi.string().required(),
		requestedBy: Joi.object().instance(GuildMember).required(),
		voiceChannel: Joi.object().instance(BaseGuildVoiceChannel),
		textChannel: Joi.object().instance(BaseGuildTextChannel),
	})
		.required()
		.xor("keyword", "id");

	constructor(
		@inject(YoutubeProvider) private youtubeProvider: IYoutubeProvider,
		@inject("QueueRepository") private queueRepository: IQueueRepository,
		@inject(delay(() => AutoAddTrackUseCase)) private autoAddTrack: AutoAddTrackUseCase
	) {
		super();
	}

	public async run(params: Params): Promise<Response> {
		const { keyword, id, requestedBy, guildId, textChannel, voiceChannel } = params;

		let queue = this.queueRepository.get(guildId);
		if (!queue) {
			if (!textChannel || !voiceChannel) throw new Error("Queue not found");
			queue = this.queueRepository.create({ guildId, voiceChannel, textChannel });
			queue.on("autoplay", () => this.autoAddTrack.execute({ queue }));
		}

		const [video] = keyword
			? await this.youtubeProvider.searchVideo(keyword)
			: [await this.youtubeProvider.getVideo(id)];
		if (!video) throw new Error("Video not found");

		queue.addTrack(
			new Track({
				id: video.id,
				duration: "duration" in video ? video.duration || 0 : 0,
				title: video.title,
				thumbnailUrl: video.thumbnails.best,
				channel: video.channel,
				requestedBy,
			})
		);

		return queue;
	}
}
