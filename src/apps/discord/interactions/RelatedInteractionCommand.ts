import { AddTrackAdapter, AddTrackUseCase } from "@modules/queue/useCases/AddTrackUseCase";
import { ButtonInteraction, GuildMember, Message, TextChannel } from "discord.js";
import { inject, injectable } from "tsyringe";
import { IInteractionCommand } from "../core/IInteractionCommand";

@injectable()
export class RelatedInteractionCommand implements IInteractionCommand<string> {
	public readonly name = "related";
	public readonly description = "Play related song";

	constructor(@inject(AddTrackUseCase) private addTrack: AddTrackUseCase) {}

	buttonInteractionIdParser(customId: string): string {
		const [, videoId] = customId.split("/");
		return videoId;
	}

	async execute(interaction: ButtonInteraction, videoId: string): Promise<void> {
		if (
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel) ||
			!(interaction.message instanceof Message)
		) {
			await interaction.deferUpdate();
			return;
		}

		const adapter = new AddTrackAdapter({
			id: videoId,
			guildId: interaction.message.guild?.id,
			textChannel: interaction.channel,
			voiceChannel: interaction.member.voice.channel || undefined,
		});
		await this.addTrack.execute(adapter, { userId: interaction.member.id });
		await interaction.deferUpdate();
	}
}
