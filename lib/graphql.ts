// QUERIES

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSession = `query GetSession($id: ID!) {
  getSession(id: $id) {
    id
    access_token
    refresh_token
  }
}
`;
export const listSessions = `query ListSessions(
  $filter: ModelSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      access_token
      refresh_token
    }
    nextToken
  }
}
`;
export const getGuildBot = `query GetGuildBot($id: ID!) {
  getGuildBot(id: $id) {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const listGuildBots = `query ListGuildBots(
  $filter: ModelGuildBotFilterInput
  $limit: Int
  $nextToken: String
) {
  listGuildBots(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      prefix
      commands {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getCommand = `query GetCommand($id: ID!) {
  getCommand(id: $id) {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const listCommands = `query ListCommands(
  $filter: ModelCommandFilterInput
  $limit: Int
  $nextToken: String
) {
  listCommands(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      guildBot {
        id
        prefix
      }
      cmd
      message
    }
    nextToken
  }
}
`;

// MUTATION
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSession = `mutation CreateSession($input: CreateSessionInput!) {
  createSession(input: $input) {
    id
    access_token
    refresh_token
  }
}
`;
export const updateSession = `mutation UpdateSession($input: UpdateSessionInput!) {
  updateSession(input: $input) {
    id
    access_token
    refresh_token
  }
}
`;
export const deleteSession = `mutation DeleteSession($input: DeleteSessionInput!) {
  deleteSession(input: $input) {
    id
    access_token
    refresh_token
  }
}
`;
export const createGuildBot = `mutation CreateGuildBot($input: CreateGuildBotInput!) {
  createGuildBot(input: $input) {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const updateGuildBot = `mutation UpdateGuildBot($input: UpdateGuildBotInput!) {
  updateGuildBot(input: $input) {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const deleteGuildBot = `mutation DeleteGuildBot($input: DeleteGuildBotInput!) {
  deleteGuildBot(input: $input) {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const createCommand = `mutation CreateCommand($input: CreateCommandInput!) {
  createCommand(input: $input) {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const updateCommand = `mutation UpdateCommand($input: UpdateCommandInput!) {
  updateCommand(input: $input) {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const deleteCommand = `mutation DeleteCommand($input: DeleteCommandInput!) {
  deleteCommand(input: $input) {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;

// SUBSCRIPTIONS

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSession = `subscription OnCreateSession {
  onCreateSession {
    id
    access_token
    refresh_token
  }
}
`;
export const onUpdateSession = `subscription OnUpdateSession {
  onUpdateSession {
    id
    access_token
    refresh_token
  }
}
`;
export const onDeleteSession = `subscription OnDeleteSession {
  onDeleteSession {
    id
    access_token
    refresh_token
  }
}
`;
export const onCreateGuildBot = `subscription OnCreateGuildBot {
  onCreateGuildBot {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const onUpdateGuildBot = `subscription OnUpdateGuildBot {
  onUpdateGuildBot {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const onDeleteGuildBot = `subscription OnDeleteGuildBot {
  onDeleteGuildBot {
    id
    prefix
    commands {
      items {
        id
        cmd
        message
      }
      nextToken
    }
  }
}
`;
export const onCreateCommand = `subscription OnCreateCommand {
  onCreateCommand {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const onUpdateCommand = `subscription OnUpdateCommand {
  onUpdateCommand {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const onDeleteCommand = `subscription OnDeleteCommand {
  onDeleteCommand {
    id
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
