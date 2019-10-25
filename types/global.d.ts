interface GPObject {
  [key: string]: string;
}

interface IGuildBot {
  id: string;
  prefix: string;
}

interface ICommand {
  id: string;
  guildBot: {
    id: string;
  };
}

interface ICustomCommand {
  id: string;
  cmd: string;
  message: string;
}
