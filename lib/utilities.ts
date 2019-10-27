export const getRandom = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const isDevMode: boolean = process.env.NODE_ENV !== "production";
