import { Interaction } from "discord.js";
import { IInteractionCommand } from "../core/IInteractionCommand";

export class OnInteractHandler {
	constructor(private commands: IInteractionCommand[]) {}

	async execute(interaction: Interaction): Promise<void> {
		if (!interaction.isButton()) return;

		const customId = interaction.customId;
		const name = customId.split("/").shift();

		const command = this.commands.find((command) => command.name === name);
		if (!command) return;

		try {
			const meta = command.buttonInteractionIdParser?.(customId) || {};
			await command.execute(interaction, meta);
		} catch (error) {
			await interaction.channel?.send(`Failed to execute the command: ${(error as Error).message}`);
		}
	}
}
