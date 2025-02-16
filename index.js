import Together from "together-ai";
import 'dotenv/config';
import fs from "fs";

const client = new Together({
    apiKey: process.env.TOGETHER_API_KEY
});

// const getDescriptionPrompt = "cual es el MONTO y el AÑO que aparece en la imagen adjunta?";
const getDescriptionPrompt = "cual es el importe de la casilla 0695?";
const imagePath = "./imagen-de-texto.png";

// Función para convertir la imagen a base64
const encodeImage = (imagePath) => {
    return fs.readFileSync(imagePath, { encoding: "base64" });
};

const base64Image = encodeImage(imagePath);

const stream = await client.chat.completions.create({
    // model: "meta-llama/Llama-Vision-Free",
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: getDescriptionPrompt },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:image/png;base64,${base64Image}`,
                    },
                },
            ],
        },
    ],
    stream: true,
});

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
}