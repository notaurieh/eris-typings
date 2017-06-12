declare module 'eris' {
  import { EventEmitter } from 'events';
  import { Readable as ReadableStream } from 'stream';

  type WebhookPayload = {
    content?: string,
    file?: { file: Buffer, name: string } | Array<{ file: Buffer, name: string}>,
    embeds?: Array<Embed>,
    username?: string,
    avatarURL?: string,
    tts?: boolean,
    wait?: boolean,
    disableEveryone?: boolean
  }

  // TODO: Not sure if this is right
  type Embed = {
    title?: string,
    type: string,
    description?: string,
    url?: string,
    timestamp?: number,
    color?: number,
    footer?: { text: string, icon_url?: string, proxy_icon_url?: string },
    image?: { url?: string, proxy_url?: string, height?: number, width?: number },
    thumbnail?: { url?: string, proxy_url?: string, height?: number, width?: number },
    video?: { url: string, height?: number, width?: number },
    provider?: { name: string, url?: string },
    fields?: Array<{ name?: string, value?: string, inline?: boolean }>
  }

  type MessageContent = string | { content?: string, tts?: boolean, disableEveryone?: boolean, embed?: Embed };
  type MessageFile = { file: Buffer | string, name: string };
  type EmojiOptions = { name: string, icon?: string, roles?: Array<string> };
  type IntegrationOptions = { expireBehavior: string, expireGracePeriod: string, enableEmoticons: string };
  type GuildOptions = {
    name?: string,
    region?: string,
    icon?: string,
    verificationLevel?: number, 
    defaultNotifications?: number,
    afkChannelID?: string,
    afkTimeout?: number,
    ownerID?: string,
    splash?: string
  }
  type MemberOptions = { roles: Array<string>, nick: string, mute: boolean, deaf: boolean, channelID: string };
  type RoleOptions = { name: string, permissions: number, color: number, hoist: boolean, mentionable: boolean };
  type GamePresence = { name: string, type?: number, url?: string };
  type SearchOptions = {
    sortBy?: string,
    sortOrder?: string,
    content?: string,
    authorID?: string,
    minID?: string,
    maxID?: string,
    limit?: number,
    offset?: number,
    contextSize?: number,
    has?: string,
    embedProviders?: string,
    embedTypes?: string,
    attachmentExtensions?: string,
    attachmentFilename?: string,
    channelIDs: Array<string>
  }
  type SearchResults = { totalResults: number, results: Array<Array<Message & { hit?: boolean }>> };
  type VoiceResourceOptions = {
    inlineVolume?: boolean,
    voiceDataTimeout?: number,
    inputArgs?: Array<string>,
    encoderArgs?: Array<string>,
    format?: string,
    frameDuration?: number,
    frameSize?: number,
    sampleRate?: number
  }
  type PossiblyUncachedMessage = Message | { id: string, channel: Channel };
  type ClientOptions = {
    autoreconnect?: boolean,
    compress?: boolean,
    connectionTimeout?: number,
    disableEvents?: { [s: string]: boolean },
    disableEveryone?: boolean,
    firstShardID?: number,
    getAllUsers?: boolean,
    guildCreateTimeout?: number,
    largeThreshold?: number,
    lastShardID?: number,
    maxShards?: number,
    messageLimit?: number,
    opusOnly?: boolean,
    restMode?: boolean,
    seedVoiceConnections?: boolean,
    sequencerWaiter?: number,
    defaultImageFormat?: string,
    defaultImageSize?: number
  }

  export class Client extends EventEmitter {
    token: string;
    bot?: boolean;
    options: ClientOptions;
    channelGuildMap: { [s: string]: string };
    shards: Collection<Shard>;
    guilds: Collection<Guild>;
    privateChannelMap: { [s: string]: string };
    privateChannels: Collection<PrivateChannel>;
    groupChannels: Collection<GroupChannel>;
    voiceConnections: Collection<VoiceConnection>;
    retryAfters: { [s: string]: number };
    guildShardMap: { [s: string]: number };
    startTime: number;
    unavailableGuilds: Collection<UnavailableGuild>;
    uptime: number;
    user: ExtendedUser;
    users: Collection<User>;
    relationships: Collection<Relationship>;
    userGuildSettings: { [s: string]: any };
    userSettings: any;
    notes: { [s: string]: string };
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
    getGateway(): Promise<string>;
    getBotGateway(): Promise<any>;
    disconnect(options: { reconnect: boolean }): void;
    joinVoiceChannel(channelID: string, options?: { shared?: boolean, opusOnly?: boolean }): Promise<VoiceConnection>;
    leaveVoiceChannel(channelID: string): void;
    editAFK(afk: boolean): void;
    editStatus(status?: string, game?: GamePresence): void;
    getChannel(channelID: string): Promise<Channel>;
    createChannel(guildID: string, name: string, type?: number, reason?: string): Promise<GuildChannel>;
    editChannel(channelID: string, options: {
      name?: string,
      icon?: string,
      ownerID?: string,
      topic?: string,
      bitrate?: number,
      userLimit?: number
    }, reason?: string): Promise<GroupChannel | GuildChannel>;
    editChannelPosition(channelID: string, position: number): Promise<void>;
    deleteChannel(channelID: string, reason?: string): Promise<void>;
    sendChannelTyping(channelID: string): Promise<void>;
    editChannelPermission(channelID: string, overwriteID: string, allow: number, deny: number, type: string, reason?:string): Promise<void>;
    deleteChannelPermission(channelID: string, overwriteID: string, reason?: string): Promise<void>;
    getChannelInvites(channelID: string): Promise<Array<Invite>>;
    createChannelInvite(channelID: string, options?: { maxAge?: number, maxUses?: number, temporary?: boolean, unique?: boolean }, reason?: string): Promise<Invite>;
    getChannelWebhooks(channelID: string): Promise<Array<any>>;
    getWebhook(webhookID: string, token?: string): Promise<any>;
    createChannelWebhook(channelID: string, options: { name: string, avatar: string }, reason?: string): Promise<any>;
    editWebhook(webhookID: string, options: { name?: string, avatar?: string }, token?: string, reason?: string): Promise<any>;
    executeWebhook(webhookID: string, token: string, options: WebhookPayload): Promise<void>;
    // TODO ???
    executeSlackWebhook(webhookID: string, token: string, options?: { wait?: boolean }): Promise<void>;
    deleteWebhook(webhookID: string, token?: string, reason?: string): Promise<void>;
    getGuildWebhooks(guildID: string): Promise<Array<any>>;
    getGuildAuditLogs(guildID: string, limit?: number, before?: string, actionType?: number): Promise<any>;
    createGuildEmoji(guildID: string, options: EmojiOptions, reason?: string): Promise<any>;
    editGuildEmoji(guildID: string, emojiID: string, options: { name?: string, roles?: Array<string> }, reason?: string): Promise<any>;
    deleteGuildEmoji(guildID: string, emojiID: string, reason?: string): Promise<void>;
    createRole(guildID: string, options?: RoleOptions, reason?: string): Promise<Role>;
    editRole(guildID: string, roleID: string, options: RoleOptions, reason?: string): Promise<Role>; // TODO not all options are available?
    editRolePosition(guildID: string, roleID: string, position: number): Promise<void>;
    deleteRole(guildID: string, roleID: string, reason?: string): Promise<void>;
    getPruneCount(guildID: string, days: number): Promise<number>;
    pruneMembers(guildID: string, days: number, reason?: string): Promise<number>;
    getVoiceRegions(guildID: string): Promise<Array<any>>;
    getInvite(inviteID: string, withCounts?: boolean): Promise<Invite>;
    acceptInvite(inviteID: string): Promise<Invite>;
    deleteInvite(inviteID: string, reason?: string): Promise<void>;
    getSelf(): Promise<ExtendedUser>;
    editSelf(options: { username?: string, avatar?: string }): Promise<ExtendedUser>;
    getDMChannel(userID: string): Promise<PrivateChannel>;
    createGroupChannel(userIDs: Array<string>): Promise<GroupChannel>;
    getMessage(channelID: string, messageID: string): Promise<Message>;
    getMessages(channelID: string, limit?: number, before?: string, after?: string, around?: string): Promise<Array<Message>>;
    getPins(channelID: string): Promise<Array<Message>>;
    createMessage(channelID: string, content: MessageContent, file: MessageFile): Promise<Message>;
    editMessage(channelID: string, messageID: string, content: MessageContent): Promise<Message>;
    pinMessage(channelID: string, messageID: string): Promise<void>;
    unpinMessage(channelID: string, messageID: string): Promise<void>;
    getMessageReaction(channelID: string, messageID: string, reaction: string, limit?: number): Promise<Array<User>>;
    addMessageReaction(channelID: string, messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReaction(channelID: string, messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactions(channelID: string, messageID: string): Promise<void>;
    deleteMessage(channelID: string, messageID: string, reason?: string): Promise<void>;
    deleteMessages(channelID: string, messageIDs: Array<string>, reason?: string): Promise<void>;
    purgeChannel(channelID: string, limit?: number, filter?: (m: Message) => boolean, before?: string, after?: string): Promise<number>;
    getGuildEmbed(guildID: string): Promise<any>;
    getGuildIntegrations(guildID: string): Promise<Array<GuildIntegration>>;
    editGuildIntegration(guildID: string, integrationID: string, options: IntegrationOptions): Promise<void>;
    deleteGuildIntegration(guildID: string, integrationID: string): Promise<void>;
    syncGuildIntegration(guildID: string, integrationID: string): Promise<void>;
    getGuildInvites(guildID: string): Promise<Array<Invite>>;
    banGuildMember(guildID: string, userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    unbanGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    createGuild(name: string, region: string, icon?: string): Promise<Guild>;
    editGuild(guildID: string, options: GuildOptions, reason?: string): Promise<Guild>;
    getGuildBans(guildID: string): Promise<Array<{ reason?: string, user: User }>>;
    editGuildMember(guildID: string, memberID: string, options: MemberOptions, reason?: string): Promise<void>;
    addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    removeGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    editNickname(guildID: string, nick: string, reason?: string): Promise<void>;
    kickGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    deleteGuild(guildID: string): Promise<void>;
    leaveGuild(guildID: string): Promise<void>;
    getOAuthApplication(appID?: string): Promise<any>;
    addRelationship(userID: string, block?: boolean): Promise<void>;
    removeRelationship(userID: string): Promise<void>;
    addGroupRecipient(groupID: string, userID: string): Promise<void>;
    removeGroupRecipient(groupID: string, userID: string): Promise<void>;
    getUserProfile(userID: string): Promise<any>;
    editUserNote(userID: string, note: string): Promise<void>;
    deleteUserNote(userID: string): Promise<void>;
    getSelfConnections(): Promise<any>;
    editSelfConnection(platform: string, id: string, data: { friendSync: boolean, visibility: number }): Promise<any>;
    deleteSelfConnection(platform: string, id: string): Promise<void>;
    getSelfSettings(): Promise<any>;
    editSelfSettings(data: {}): Promise<any>;
    getSelfMFACodes(password: string, regenerate?: boolean): Promise<any>;
    enableSelfMFATOTP(secret: string, code: string): Promise<any>;
    disableSelfMFATOTP(code: string): Promise<any>;
    getSelfBilling(): Promise<any>;
    getSelfPayments(): Promise<any>;
    addSelfPremiumSubscription(token: string, plan: string): Promise<void>;
    deleteSelfPremiumSubscription(): Promise<void>;
    getRESTChannel(channelID: string): Promise<Channel>;
    getRESTGuild(guildID: string): Promise<Guild>;
    getRESTGuilds(limit?: number, before?: string, after?: string): Promise<Array<Guild>>;
    getRESTGuildChannels(guildID: string): Promise<Array<GuildChannel>>;
    getRESTGuildEmojis(guildID: string): Promise<Array<EmojiOptions>>; // TODO rethink emojioptions
    getRESTGuildEmoji(guildID: string, emojiID: string): Promise<EmojiOptions>;
    getRESTGuildMembers(guildID: string, limit?: number, after?: string): Promise<Array<Member>>;
    getRESTGuildMember(guildID: string, memberID: string): Promise<Member>;
    getRESTGuildRoles(guildID: string): Promise<Array<Role>>;
    getRESTUser(userID: string): Promise<User>;
    searchChannelMessages(channelID: string, query: SearchOptions): Promise<SearchResults>;
    searchGuildMessages(guildID: string, query: SearchOptions): Promise<SearchResults>;
    on(event: string, listener: Function): this;
    on(event: "callCreate", listener: (call: Call) => void): this;
    on(event: "callDelete", listener: (call: Call) => void): this;
    on(event: "callRing", listener: (call: Call) => void): this;
    on(event: "callUpdate", listener: (call: Call, oldCall: { participants: Array<string>, endedTimestamp?: number, ringing: Array<string>, region: string, unavailable: boolean }) => void): this;
    on(event: "channelCreate", listener: (channel: Channel) => void): this;
    on(event: "channelDelete", listener: (channel: Channel) => void): this;
    on(event: "channelPinUpdate", listener: (channel: Channel, timestamp: number, oldTimestamp: number) => void): this;
    on(event: "channelRecipientAdd", listener: (channel: GroupChannel, user: User) => void): this;
    on(event: "channelRecipientRemove", listener: (channel: GroupChannel, user: User) => void): this;
    on(event: "channelUpdate", listener: (channel: Channel, oldChannel: { name: string, position: string, topic?: string, bitrate?: number, permissionOverwrites: Collection<PermissionOverwrite> }) => void): this;
    on(event: "connect", listener: (id: number) => void): this;
    on(event: "debug", listener: (message: string, id: number) => void): this;
    on(event: "error", listener: (err: Error, id: number) => void): this;
    on(event: "friendSuggestionCreate", listener: (user: User, reasons: Array<{ type: number, platform_type: string, name: string }>) => void): this;
    on(event: "friendSuggestionDelete", listener: (user: User) => void): this;
    on(event: "guildAvailable", listener: (guild: Guild) => void): this;
    on(event: "guildBanAdd", listener: (guild: Guild, user: User) => void): this;
    on(event: "guildBanRemove", listener: (guild: Guild, user: User) => void): this;
    on(event: "guildCreate", listener: (guild: Guild) => void): this;
    on(event: "guildDelete", listener: (guild: Guild) => void): this;
    on(event: "guildEmojisUpdate", listener: (guild: Guild, emojis: Array<EmojiOptions>, oldEmojis: Array<EmojiOptions>) => void): this;
    on(event: "guildMemberAdd", listener: (guild: Guild, member: Member) => void): this;
    on(event: "guildMemberChunk", listener: (guild: Guild, members: Array<Member>) => void): this;
    on(event: "guildMemberRemove", listener: (guild: Guild, member: Member | { id: string, user: User }) => void): this;
    on(event: "guildMemberUpdate", listener: (guild: Guild, member: Member, oldMember: { roles: Array<string>, nick?: string }) => void): this;
    on(event: "guildRoleCreate", listener: (guild: Guild, role: Role) => void): this;
    on(event: "guildRoleDelete", listener: (guild: Guild, role: Role) => void): this;
    on(event: "guildRoleUpdate", listener: (guild: Guild, role: Role, oldRole: RoleOptions) => void): this;
    on(event: "guildUnavailable", listener: (guild: Guild) => void): this;
    on(event: "guildUpdate", listener: (guild: Guild, oldGuild: GuildOptions) => void): this;
    on(event: "messageCreate", listener: (message: Message) => void): this;
    on(event: "messageDelete", listener: (message: PossiblyUncachedMessage) => void): this;
    on(event: "messageDeleteBulk", listener: (messages: Array<PossiblyUncachedMessage>) => void): this;
    on(event: "messageReactionAdd", listener: (message: PossiblyUncachedMessage, emoji: EmojiOptions, userID: string) => void): this;
    on(event: "messageReactionRemove", listener: (message: PossiblyUncachedMessage, emoji: EmojiOptions, userID: string) => void): this;
    on(event: "messageReactionRemoveAll", listener: (message: PossiblyUncachedMessage) => void): this;
    on(event: "messageUpdate", listener: (message: Message, oldMessage?: {
      attachments: Array<any>,
      embeds: Array<Embed>,
      content: string,
      editedTimestamp?: number,
      mentionedBy?: any,
      tts: boolean,
      mentions: Array<string>,
      roleMentions: Array<string>,
      channelMentions: Array<string>
    }) => void): this;
    on(event: "presenceUpdate", listener: (other: Member | Relationship, oldPresence?: {
      status: string,
      game?: {
        name: string,
        type: number,
        url?: string
      }
    }) => void): this;
    on(event: "rawWS", listener: (packet: any, id: number) => void): this;
    on(event: "relationshipAdd", listener: (relationship: Relationship) => void): this;
    on(event: "relationshipRemove", listener: (relationship: Relationship) => void): this;
    on(event: "relationshipUpdate", listener: (relationship: Relationship, oldRelationship: { type: number } ) => void): this;
    on(event: "shardDisconnect", listener: (err: Error, id: number) => void): this;
    on(event: "shardPreReady", listener: (id: number) => void): this;
    on(event: "shardReady", listener: (id: number) => void): this;
    on(event: "shardResume", listener: (id: number) => void): this;
    on(event: "typingStart", listener: (channel: Channel, user: User) => void): this;
    on(event: "unavailableGuildCreate", listener: (guild: UnavailableGuild) => void): this;
    on(event: "unknown", listener: (packet: any, id: number) => void): this;
    on(event: "userUpdate", listener: (user: User, oldUser: { username: string, discriminator: string, avatar?: string }) => void): this;
    on(event: "voiceChannelJoin", listener: (member: Member, newChannel: GuildChannel) => void): this;
    on(event: "voiceChannelLeave", listener: (member: Member, oldChannel: GuildChannel) => void): this;
    on(event: "voiceChannelSwitch", listener: (member: Member, newChannel: GuildChannel, oldChannel: GuildChannel) => void): this;
    on(event: "voiceStateUpdate", listener: (member: Member, oldState: { mute: boolean, deaf: boolean, selfMute: boolean, selfDeaf: boolean }) => void): this;
    on(event: "warn", listener: (message: string, id: number) => void): this;
  }

  export class VoiceConnection extends EventEmitter {
    id: string;
    channelID: string;
    connecting: boolean;
    ready: boolean;
    playing: boolean;
    paused: boolean;
    volume: number;
    current?: {
      startTime: number,
      playTime: number,
      pausedTimestamp?: number,
      pausedTime?: number,
      options: VoiceResourceOptions // ????
    }
    constructor(id: string, options?: { shard?: Shard, shared?: boolean, opusOnly?: boolean });
    pause(): void;
    play(resource: ReadableStream | string, options: VoiceResourceOptions): void;
    receive(type: string): VoiceDataStream;
    resume(): void;
    setVolume(volume: number): void;
    stopPlaying(): void;
    switchChannel(channelID: string): void;
    updateVoiceState(selfMute: boolean, selfDeaf: boolean): void;
    on(event: string, listener: Function): this;
    on(event: "debug", listener: (message: string) => void): this;
    on(event: "disconnect", listener: (err: Error) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "pong", listener: (latency: number) => void): this;
    on(event: "speakingStart", listener: (userID: string) => void): this;
    on(event: "warn", listener: (message: string) => void): this;
  }

  export class SharedStream extends EventEmitter {
    add(connection: VoiceConnection): void;
    play(resource: ReadableStream | string, options: VoiceResourceOptions): void;
    remove(connection: VoiceConnection): void;
    stopPlaying(): void;
  }

  class VoiceDataStream {
    type: string;
    constructor(type: string);
  }

  // thonk, does T have to be a voice connection?
  export class VoiceConnectionManager<T extends VoiceConnection> extends Collection<T> { // owo an undocumented class
    constructor(vcObject: new () => T);
    join(guildID: string, channelID: string, options: any): Promise<T>; // whats options ???
    leave(guildID: string): void;
    switch(guildID: string, channelID: string): void;
  }

  class Base {
    id: string;
    createdAt: number;
    constructor(id: string);
    toJSON(arg: any, cache: Array<any>): Object;
    inspect(): string;
  }

  export class Bucket {
    tokens: number;
    lastReset: number;
    lastSend: number;
    tokenLimit: number;
    interval: number;
    constructor(tokenLimit: number, interval: number, latencyRef: { latency: number });
    queue(func: Function): void;
  }

  export class Collection<T extends { id: any }> extends Map<string, T> {
    baseObject: new () => T;
    limit?: number;
    constructor(baseObject: new () => T, limit?: number);
    add(obj: T, extra?: any, replace?: boolean): T;
    find(func: (i: T) => boolean): T;
    random(): T;
    filter(func: (i: T) => boolean): Array<T>;
    map<R>(func: (i: T) => R): Array<R>;
    update(obj: T, extra?: any, replace?: boolean): T;
    remove(obj: T | { id: string }): T;
  }

  export class Call extends Base {
    id: string;
    createdAt: number;
    channel: GroupChannel;
    voiceStates: Collection<VoiceState>;
    participants: Array<string>;
    endedTimestamp?: number;
    ringing?: Array<string>;
    region?: string;
    unavailable: boolean;
    constructor(data: any, channel: GroupChannel);
  }
  
  export class Channel extends Base {
    id: string;
    createdAt: number;
    constructor(data: any);
    sentTyping(): Promise<void>;
    getMessage(messageID: string): Promise<Message>;
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Array<Message>>;
    getPins(): Promise<Array<Message>>;
    createMessage(
      content: MessageContent,
      file?: MessageFile
    ): Promise<Message>;
    editMessage(messageID: string, content: MessageContent): Promise<Message>;
    pinMessage(messageID: string): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
    getMessageReaction(messageID: string, reaction: string, limit?: number): Promise<Array<User>>;
    addMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactions(messageID: string): Promise<void>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
    deleteMessages(messageIDs: Array<string>): Promise<void>;
    purge(limit?: number, filter?: (m: Message) => boolean, before?: string, after?: string): Promise<number>;
  }

  export class ExtendedUser extends User {
    email: string;
    verified: boolean;
    mfaEnabled: boolean;
  }

  export class GroupChannel extends PrivateChannel {
    recipients: Collection<User>;
    name: string;
    icon?: string;
    iconURL?: string;
    ownerID: string;
    edit(options: { name?: string, icon?: string, ownerID?: string }): Promise<GroupChannel>;
    addRecipient(userID: string): Promise<void>;
    removeRecipient(userID: string): Promise<void>;
    dynamicIconURL(format: string, size: number): string;
  }

  export class Guild extends Base {
    id: string;
    createdAt: number;
    name: string;
    verificationLevel: number;
    region: string;
    defaultChannel: GuildChannel;
    icon?: string;
    afkChannelID: string;
    afkTimeout: number;
    defaultNotifications: number;
    mfaLevel: number;
    joinedAt: number;
    ownerID: string;
    splash?: string;
    unavailable: boolean;
    large: boolean;
    maxPresences: number;
    channels: Collection<GuildChannel>;
    members: Collection<Member>;
    memberCount: number;
    roles: Collection<Role>;
    shard: Shard;
    features: Array<any>;
    emojis: Array<EmojiOptions>;
    iconURL?: string;
    explicitContentFilter: number;
    constructor(data: any, client: Client);
    fetchAllMembers(): void;
    dynamicIconURL(format: string, size: number): string;
    createChannel(name: string, type: string): Promise<GuildChannel>;
    createEmoji(options: { name: string, image: string, roles?: Array<string> }, reason?: string): Promise<EmojiOptions>;
    editEmoji(emojiID: string, options: { name: string, roles?: Array<string> }, reason?: string): Promise<EmojiOptions>;
    deleteEmoji(emojiID: string, reason?: string): Promise<void>;
    createRole(options: RoleOptions, reason?: string): Promise<Role>;
    getPruneCount(days: number): Promise<number>;
    pruneMembers(days: number, reason?: string): Promise<number>;
    getRESTChannels(): Promise<Array<GuildChannel>>;
    getRESTEmojis(): Promise<Array<EmojiOptions>>;
    getRESTEmoji(emojiID: string): Promise<EmojiOptions>;
    getRESTMembers(limit?: number, after?: string): Promise<Array<Member>>;
    getRESTMember(memberID: string): Promise<Member>;
    getRESTRoles(): Promise<Array<Role>>;
    getEmbed(): Promise<any>;
    getVoiceRegions(): Promise<Array<any>>;
    editRole(roleID: string, options: RoleOptions): Promise<Role>;
    deleteRole(roleID: string): Promise<void>;
    getAuditLogs(limit?: number, before?: string, actionType?: number): Promise<any>;
    getIntegrations(): Promise<GuildIntegration>;
    editIntegration(integrationID: string, options: IntegrationOptions): Promise<void>;
    syncIntegration(integrationID: string): Promise<void>;
    deleteIntegration(integrationID: string): Promise<void>;
    getInvites(): Promise<Array<Invite>>;
    editMember(memberID: string, options: MemberOptions, reason?: string): Promise<void>;
    addMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    removeMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    kickMember(userID: string, reason?: string): Promise<void>;
    banMember(userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    unbanMember(userID: string, reason?: string): Promise<void>;
    edit(
      options: GuildOptions, reason?: string
    ): Promise<Guild>;
    delete(): Promise<void>;
    leave(): Promise<void>;
    getBans(): Promise<Array<User>>;
    editNickname(nick: string): Promise<void>;
    getWebhooks(): Promise<Array<any>>;
  }

  export class GuildAuditLogEntry extends Base {
    id: string;
    guild: Guild;
    actionType: number;
    reason?: string;
    user: User;
    targetID: string;
    target?: Guild | GuildChannel | Member | Invite | Role | any;
    before?: any;
    after?: any;
    count?: number;
    channel?: GuildChannel;
    deleteMemberDays?: number;
    membersRemoved?: number;
    member?: Member | any;
    role?: Role | any;
    constructor(data: any, guild: Guild);
  }

  export class GuildChannel extends Channel {
    mention: string;
    guild: Guild;
    messages: Collection<Message>;
    lastMessageID: string;
    lastPinTimestamp: number;
    permissionOverwrites: Collection<PermissionOverwrite>;
    type: number;
    name: string;
    position: number;
    topic?: string;
    bitrate?: number;
    userLimit?: number;
    nsfw: boolean;
    voiceMembers?: Collection<Member>;
    constructor(data: any, guild: Guild, messageLimit: number);
    permissionsOf(memberID: string): Permission;
    edit(
      options: {
        name: string,
        topic: string,
        bitrate: number,
        userLimit: number
      }, reason?: string
    ): Promise<GuildChannel>;
    editPosition(position: number): Promise<void>;
    delete(reason?: string): Promise<void>;
    editPermission(overwriteID: string, allow: number, deny: number, type: string, reason?: string): Promise<PermissionOverwrite>;
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    getInvites(): Promise<Array<Invite>>;
    createInvite(options: { maxAge: number, maxUses: number, temporary: boolean }, reason?: string): Promise<Invite>;
    getWebhooks(): Promise<Array<any>>;
    createWebhook(options: { name: string, avatar: string }, reason?: string): Promise<any>;
  }

  export class GuildIntegration extends Base {
    id: string;
    createdAt: number;
    name: string;
    type: string;
    roleID: string;
    user: User;
    account: { id: string, name: string };
    enabled: boolean;
    syncing: boolean;
    expireBehavior: number;
    expireGracePeriod: number;
    enableEmoticons: boolean;
    subscriberCount: number;
    syncedAt: number;
    constructor(data: any, guild: Guild);
    edit(options: { expireBehavior: string, expireGracePeriod: string, enableEmoticons: string }): Promise<void>;
    delete(): Promise<void>;
    sync(): Promise<void>;
  }

  export class Invite {
    code: string;
    channel: { id: string, name: string };
    guild: { id: string, name: string, splash?: string, icon?: string, textChannelCount?: number, voiceChannelCount?: number };
    inviter?: User;
    uses?: number;
    maxUses?: number;
    maxAge?: number;
    temporary?: boolean;
    createdAt?: number;
    revoked?: boolean;
    presenceCount?: number;
    memberCount?: number;
    constructor(data: any, client: Client);
    delete(reason?: string): Promise<void>;
  }

  export class Member extends Base {
    id: string;
    mention: string;
    guild: Guild;
    joinedAt: number;
    status: string;
    game?: GamePresence;
    voiceState: VoiceState;
    nick?: string;
    roles: Array<string>;
    user: User;
    permission: Permission;
    defaultAvatar: string;
    createdAt: number;
    bot: boolean;
    username: string;
    discriminator: string;
    avatar?: string;
    defaultAvatarURL: string;
    avatarURL: string;
    staticAvatarURL: string;
    constructor(data: any, guild: Guild);
    edit(
      options: MemberOptions, reason?: string
    ): Promise<void>;
    addRole(roleID: string, reason?: string): Promise<void>;
    removeRole(roleID: string, reason?: string): Promise<void>;
    kick(reason?: string): Promise<void>;
    ban(deleteMessageDays?: number, reason?: string): Promise<void>;
    unban(reason?: string): Promise<void>;
  }

  export class Message extends Base {
    id: string;
    createdAt: number;
    channel: Channel;
    // guild: Guild?;
    timestamp: number;
    type: number;
    author: User;
    member?: Member;
    mentions: Array<User>;
    content: string;
    cleanContent?: string;
    roleMentions: Array<string>;
    channelMentions?: Array<string>;
    editedTimestamp?: number;
    tts: boolean;
    mentionEveryone: boolean;
    attachments: Array<any>; // TODO what props do these have
    embeds: Array<Embed>;
    reactions: { [s: string]: any, count: number, me: boolean };
    command: boolean;
    constructor(data: any, client: Client);
    edit(content: MessageContent): Promise<Message>;
    pin(): Promise<void>;
    unpin(): Promise<void>;
    getReaction(reaction: string, limit?: number): Promise<Array<User>>;
    addReaction(reaction: string, userID?: string): Promise<void>;
    removeReaction(reaction: string, userID?: string): Promise<void>;
    removeReactions(): Promise<void>;
    delete(reason?: string): Promise<void>;
  }

  export class Permission {
    allow: number;
    deny: number;
    json: { [s: string]: boolean };
    constructor(allow: number, deny: number);
    has(permission: string): boolean;
  }

  export class PermissionOverwrite extends Permission {
    id: string;
    createdAt: number;
    type: string;
    constructor(data: { allow: number, deny: number });
  }

  export class PrivateChannel extends Channel {
    lastMessageID: string;
    recipient: User;
    messages: Collection<Message>;
    ring(recipient: Array<string>): void;
    syncCall(): void;
    leave(): Promise<void>;
  }

  export class Relationship {
    id: string;
    user: User;
    type: number;
    status: string;
    game?: GamePresence;
    constructor(data: any, client: Client);
  }

  export class Role extends Base {
    id: string;
    createdAt: number;
    guild: Guild;
    mention: string;
    name: string;
    mentionable: boolean;
    managed: boolean;
    hoist: boolean;
    color: number;
    position: number;
    permissions: Permission;
    json: { [s: string]: boolean };
    constructor(data: any, guild: Guild);
    edit(options: RoleOptions, reason?: string): Promise<Role>;
    editPosition(position: number): Promise<void>;
    delete(reason?: string): Promise<void>;
  }

  export class UnavailableGuild extends Base {
    id: string;
    createdAt: number;
    unavailable: boolean;
    shard: Shard;
    constructor(data: any, client: Client);
  }

  export class User extends Base {
    id: string;
    mention: string;
    defaultAvatar: string;
    createdAt: number;
    bot: boolean;
    username: string;
    discriminator: string;
    avatar?: string;
    defaultAvatarURL: string;
    avatarURL: string;
    staticAvatarURL: string;
    constructor(data: any, client: Client);
    dynamicIconURL(format?: string, size?: number): string;
    getDMChannel(): Promise<PrivateChannel>;
    addRelationship(block?: boolean): Promise<void>;
    removeRelationship(): Promise<void>;
    getProfile(): Promise<any>;
    editNote(note: string): Promise<void>;
    deleteNote(): Promise<void>;
  }

  export class VoiceState extends Base {
    id: string;
    createdAt: number;
    sessionID?: string;
    channelID?: string;
    mute: boolean;
    deaf: boolean;
    suppress: boolean;
    selfMute: boolean;
    selfDeaf: boolean;
    constructor(data: any);
  }

  export class Shard extends EventEmitter {
    id: string;
    connecting: boolean;
    ready: boolean;
    discordServerTrace?: Array<string>;
    status: string;
    lastHeartbeatReceived: number;
    lastHeartbeatSent: number;
    latency: number;
    constructor(id: number, client: Client);
    connect(): void;
    disconnect(options?: { reconnect: boolean }): void;
    editAFK(afk: boolean): void;
    editStatus(status?: string, game?: GamePresence): void;
    on(event: string, listener: Function): this;
    on(event: "disconnect", listener: (err: Error) => void): this;
  }
}

