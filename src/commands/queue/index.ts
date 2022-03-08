import { Command, MessageEmbed } from "discord.js";

const command: Command = {
	name: "queue",
	aliases: ["q"],
	description: "Show current queue",
	async execute(message, args) {
		const queue = message.queue;
		if (!queue) return;

		const page = +(args.shift() || 1) - 1;
		const perPage = 10;

		const start = page * perPage;
		const end = (page + 1) * perPage;

		const paginatedQueue = queue.tracks.slice(start, end);

		const embed = new MessageEmbed({
			title: "Queue",
			description: `Showing page **${page + 1}** / **${Math.ceil(queue.tracks.length / perPage)}**`,
			fields: paginatedQueue.map((track, index) => ({
				name: `${start + index + 1}. ${track.title}`,
				value: `${track.url}\r\nRequested by <@!${track.requestedBy?.id}>`,
			})),
		});

		message.reply({ embeds: [embed] });
	},
};

export default command;