import { joinVoiceChannel } from "@discordjs/voice";
import { Queue } from "@modules/queue/domain/Queue";
import { BaseGuildTextChannel, BaseGuildVoiceChannel } from "discord.js";
import { IQueueRepository } from "../IQueueRepository";

type CreateProps = {
	voiceChannel: BaseGuildVoiceChannel;
	textChannel: BaseGuildTextChannel;
	guildId: string;
};

export class QueueMemoryRepository implements IQueueRepository {
	private queues: Map<string, Queue> = new Map();

	public get(guildId: string): Queue | undefined {
		return this.queues.get(guildId);
	}

	public getByUserId(userId: string): Queue | undefined {
		const queues = [...this.queues.values()];
		return queues.find((q) => q.voiceChannel.members.has(userId));
	}

	public delete(guildId: string): void {
		this.queues.delete(guildId);
	}

	public create({ guildId, voiceChannel, textChannel }: CreateProps): Queue {
		const queue = new Queue({
			voiceConnection: joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: voiceChannel.guild.id,
				adapterCreator: voiceChannel.guild.voiceAdapterCreator,
			}),
			voiceChannel,
			textChannel,
		});

		this.queues.set(guildId, queue);
		return queue;
	}
}
