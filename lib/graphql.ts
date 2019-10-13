// QUERIES

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

export const getGuildBot = `query GetGuildBot($id: ID!) {
  getGuildBot(id: $id) {
    id
    prefix
    commands {
      items {
        cmd
        message
      }
      nextToken
    }
  }
}
`;

// MUTATION
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
    cmd
    message
  }
}
`;
