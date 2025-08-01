type TConfig = {
  apiKey: string;
};

export const config: TConfig = {
  apiKey: process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY!,
};
