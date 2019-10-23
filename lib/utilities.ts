export const getRandom = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const isDevMode = !["staging", "production"].includes(
  process.env.NODE_ENV
);
