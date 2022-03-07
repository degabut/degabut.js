import { EmbedField, MessageButton } from "discord.js";
import { Video, VideoCompact } from "youtubei";

const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

export const videoToMessageButton = (
	video: Video | VideoCompact,
	index: number,
	idPrefix?: string
): MessageButton => {
	return new MessageButton({
		customId: `${idPrefix}/${video.id}`,
		label: video.title.length < 20 ? video.title : video.title.substring(0, 20) + "...",
		style: "SUCCESS",
		emoji: numbers[index],
	});
};

export const videoToEmbedField = (video: Video | VideoCompact, index: number): EmbedField => {
	return {
		name: `${numbers[index]}. ${video.title}`,
		value: "Duration: " + video.duration,
		inline: false,
	};
};
