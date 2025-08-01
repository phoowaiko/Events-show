type TConfig = {
  apiKey: string;
};

export const config: TConfig = {
  apiKey: process.env.TICKETMASTER_API_KEY!,
};
