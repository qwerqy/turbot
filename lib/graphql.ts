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
    plugins {
      items {
        id
        name
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
      plugins {
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
      plugins {
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
export const getPlugin = `query GetPlugin($id: ID!) {
  getPlugin(id: $id) {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const listPlugins = `query ListPlugins(
  $filter: ModelPluginFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlugins(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getPluginCommand = `query GetPluginCommand($id: ID!) {
  getPluginCommand(id: $id) {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const listPluginCommands = `query ListPluginCommands(
  $filter: ModelPluginCommandFilterInput
  $limit: Int
  $nextToken: String
) {
  listPluginCommands(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      plugin {
        id
        name
      }
      cmd
    }
    nextToken
  }
}
`;
export const getPluginSetting = `query GetPluginSetting($id: ID!) {
  getPluginSetting(id: $id) {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;
export const listPluginSettings = `query ListPluginSettings(
  $filter: ModelPluginSettingFilterInput
  $limit: Int
  $nextToken: String
) {
  listPluginSettings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      plugin {
        id
        name
      }
      name
      enabled
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
    plugins {
      items {
        id
        name
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
    plugins {
      items {
        id
        name
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
    plugins {
      items {
        id
        name
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
      plugins {
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
      plugins {
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
      plugins {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const createPlugin = `mutation CreatePlugin($input: CreatePluginInput!) {
  createPlugin(input: $input) {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const updatePlugin = `mutation UpdatePlugin($input: UpdatePluginInput!) {
  updatePlugin(input: $input) {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const deletePlugin = `mutation DeletePlugin($input: DeletePluginInput!) {
  deletePlugin(input: $input) {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const createPluginCommand = `mutation CreatePluginCommand($input: CreatePluginCommandInput!) {
  createPluginCommand(input: $input) {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const updatePluginCommand = `mutation UpdatePluginCommand($input: UpdatePluginCommandInput!) {
  updatePluginCommand(input: $input) {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const deletePluginCommand = `mutation DeletePluginCommand($input: DeletePluginCommandInput!) {
  deletePluginCommand(input: $input) {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const createPluginSetting = `mutation CreatePluginSetting($input: CreatePluginSettingInput!) {
  createPluginSetting(input: $input) {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;
export const updatePluginSetting = `mutation UpdatePluginSetting($input: UpdatePluginSettingInput!) {
  updatePluginSetting(input: $input) {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;
export const deletePluginSetting = `mutation DeletePluginSetting($input: DeletePluginSettingInput!) {
  deletePluginSetting(input: $input) {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;

// SUBSCRIPTION

/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
    plugins {
      items {
        id
        name
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
    plugins {
      items {
        id
        name
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
    plugins {
      items {
        id
        name
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
      plugins {
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
      plugins {
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
      plugins {
        nextToken
      }
    }
    cmd
    message
  }
}
`;
export const onCreatePlugin = `subscription OnCreatePlugin {
  onCreatePlugin {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const onUpdatePlugin = `subscription OnUpdatePlugin {
  onUpdatePlugin {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const onDeletePlugin = `subscription OnDeletePlugin {
  onDeletePlugin {
    id
    name
    guildBot {
      id
      prefix
      commands {
        nextToken
      }
      plugins {
        nextToken
      }
    }
    commands {
      items {
        id
        name
        cmd
      }
      nextToken
    }
    settings {
      items {
        id
        name
        enabled
      }
      nextToken
    }
  }
}
`;
export const onCreatePluginCommand = `subscription OnCreatePluginCommand {
  onCreatePluginCommand {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const onUpdatePluginCommand = `subscription OnUpdatePluginCommand {
  onUpdatePluginCommand {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const onDeletePluginCommand = `subscription OnDeletePluginCommand {
  onDeletePluginCommand {
    id
    name
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    cmd
  }
}
`;
export const onCreatePluginSetting = `subscription OnCreatePluginSetting {
  onCreatePluginSetting {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;
export const onUpdatePluginSetting = `subscription OnUpdatePluginSetting {
  onUpdatePluginSetting {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;
export const onDeletePluginSetting = `subscription OnDeletePluginSetting {
  onDeletePluginSetting {
    id
    plugin {
      id
      name
      guildBot {
        id
        prefix
      }
      commands {
        nextToken
      }
      settings {
        nextToken
      }
    }
    name
    enabled
  }
}
`;
