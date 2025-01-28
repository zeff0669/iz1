declare module 'whatsapp-web.js/src/structures/GroupChat' {
    export default class GroupChat {
      _patch(data: any): void;
      get owner(): ContactId;
      get createdAt(): Date;
      get description(): string;
      get participants(): Array<GroupParticipant>;
      async addParticipants(participantIds: Array<string>): Promise<Object>;
      async removeParticipants(participantIds: Array<string>): Promise<Object>;
      async promoteParticipants(participantIds: Array<string>): Promise<{ status: number }>;
      async demoteParticipants(participantIds: Array<string>): Promise<{ status: number }>;
      async setSubject(subject: string): Promise<boolean>;
      async setDescription(description: string): Promise<boolean>;
      async setMessagesAdminsOnly(adminsOnly: boolean = true): Promise<boolean>;
      async setInfoAdminsOnly(adminsOnly: boolean = true): Promise<boolean>;
      async deletePicture(): Promise<boolean>;
      async setPicture(media: MessageMedia): Promise<boolean>;
      async getInviteCode(): Promise<string>;
      async revokeInvite(): Promise<string>;
      async leave(): Promise<void>;
    }
}
  