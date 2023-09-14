module Test.Data.GraphQL.ParseFull2 where

import Prelude
import Data.Either (either)
import Data.GraphQL.AST as AST
import Data.GraphQL.Parser as GP
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Test.Spec (SpecT, before, describe, it)
import Parsing (runParser)

parseDocument ∷ String → Aff (AST.Document)
parseDocument t = liftEffect (either (throw <<< show) pure (runParser t GP.document))

-- uses a more full featured schema
-- in this case, the publically available code sandbox schema
query =
  """
schema {
  query: RootQueryType
  mutation: RootMutationType
  subscription: RootSubscriptionType
}

enum Authorization {
  COMMENT
  NONE
  OWNER
  READ
  WRITE_CODE
  WRITE_PROJECT
}

type Bookmarked {
  entity: BookmarkEntity
  isBookmarked: Boolean
}

union BookmarkEntity = Team | User

input CodeReference {
  anchor: Int!
  code: String!
  head: Int!
  lastUpdatedAt: String!
  path: String!
}

type CodeReferenceMetadata {
  anchor: Int!
  code: String!
  head: Int!
  path: String!
  sandboxId: String!
}

type Collaborator {
  authorization: Authorization!
  id: ID!
  lastSeenAt: DateTime
  sandbox: Sandbox!
  user: User!
  warning: String
}

type Collection {
  id: ID
  path: String!
  sandboxes: [Sandbox!]!
  team: Team
  teamId: ID
  user: User
}

type Comment {
  comments: [Comment!]!
  content: String
  id: ID!
  insertedAt: NaiveDateTime!
  isRead: Boolean!
  isResolved: Boolean!
  parentComment: Comment
  references: [Reference!]!
  replyCount: Int!
  sandbox: Sandbox!
  updatedAt: NaiveDateTime!
  user: User!
}

type CurrentUser {
  bookmarkedTemplates: [Template!]!
  collection(path: String!, teamId: ID): Collection
  collections(teamId: ID): [Collection!]!
  email: String!
  firstName: String
  id: ID!
  lastName: String
  notifications(limit: Int, orderBy: OrderBy, type: [String]): [Notification]
  recentlyUsedTemplates: [Template!]!
  sandboxes(limit: Int, orderBy: OrderBy, showDeleted: Boolean): [Sandbox!]!
  team(id: ID!): Team
  teams: [Team!]!
  templates(showAll: Boolean, teamId: ID): [Template!]!
  username: String!
}

scalar DateTime

enum Direction {
  ASC
  DESC
}

type Git {
  branch: String
  commitSha: String
  id: ID
  path: String
  repo: String
  username: String
}

type Invitation {
  authorization: Authorization!
  email: String
  id: ID
  sandbox: Sandbox!
  token: String!
}

scalar NaiveDateTime

type Notification {
  archived: Boolean!
  data: String!
  id: ID!
  insertedAt: NaiveDateTime!
  read: Boolean!
  type: String!
}

input OrderBy {
  direction: Direction!
  field: String!
}

type Reference {
  id: ID!
  metadata: ReferenceMetadata!
  resource: String!
  type: String!
}

union ReferenceMetadata = CodeReferenceMetadata

type RootMutationType {
  updateComment(commentId: ID!, content: String, sandboxId: ID!): Comment!

  archiveAllNotifications: User!

  markNotificationAsRead(notificationId: ID!): Notification!

  removeFromTeam(teamId: ID!, userId: ID!): Team!

  deleteSandboxes(sandboxIds: [ID!]!): [Sandbox!]!

  deleteCollection(path: String!, teamId: ID): [Collection!]!

  bookmarkTemplate(teamId: ID, templateId: ID!): Template

  setTeamName(name: String!, teamId: ID!): Team!

  acceptTeamInvitation(teamId: ID!): Team!

  setTeamDescription(description: String!, teamId: ID!): Team!
  renameSandbox(id: ID!, title: String!): Sandbox!
  unresolveComment(commentId: ID!, sandboxId: ID!): Comment!
  resolveComment(commentId: ID!, sandboxId: ID!): Comment!
  revokeSandboxInvitation(invitationId: ID!, sandboxId: ID!): Invitation!

  deleteComment(commentId: ID!, sandboxId: ID!): Comment!
  createSandboxInvitation(
    authorization: Authorization!
    email: String!
    sandboxId: ID!
  ): Invitation!

  leaveTeam(teamId: ID!): String!
  createComment(
    codeReference: CodeReference
    content: String!
    id: ID
    parentCommentId: ID
    sandboxId: ID!
  ): Comment!

  clearNotificationCount: User!

  addToCollection(
    collectionPath: String!
    sandboxIds: [ID]!
    teamId: ID
  ): Collection!

  addCollaborator(
    authorization: Authorization!
    sandboxId: ID!
    username: String!
  ): Collaborator!
  changeSandboxInvitationAuthorization(
    authorization: Authorization!
    invitationId: ID!
    sandboxId: ID!
  ): Invitation!
  setSandboxesPrivacy(privacy: Int, sandboxIds: [ID!]!): [Sandbox!]!

  markAllNotificationsAsRead: User!

  redeemTeamInviteToken(inviteToken: String!): Team!

  unmakeSandboxesTemplates(sandboxIds: [ID!]!): [Template!]!

  revokeTeamInvitation(teamId: ID!, userId: ID!): Team!

  createCollection(path: String!, teamId: ID): Collection!

  createTeam(name: String!): Team!

  makeSandboxesTemplates(sandboxIds: [ID!]!): [Template!]!

  renameCollection(
    newPath: String!
    newTeamId: ID
    path: String!
    teamId: ID
  ): [Collection!]!

  changeCollaboratorAuthorization(
    authorization: Authorization!
    sandboxId: ID!
    username: String!
  ): Collaborator!

  inviteToTeamViaEmail(email: String!, teamId: ID!): String!

  unbookmarkTemplate(teamId: ID, templateId: ID!): Template

  archiveNotification(notificationId: ID!): Notification!
  redeemSandboxInvitation(invitationToken: String!, sandboxId: ID!): Invitation!
  permanentlyDeleteSandboxes(sandboxIds: [ID!]!): [Sandbox!]!

  inviteToTeam(teamId: ID!, username: String!): Team!

  rejectTeamInvitation(teamId: ID!): String!

  removeCollaborator(sandboxId: ID!, username: String!): Collaborator!
}

type RootQueryType {
  me: CurrentUser

  sandbox(sandboxId: ID!): Sandbox

  teamByToken(inviteToken: String!): Team
}

type RootSubscriptionType {
  collaboratorAdded(sandboxId: ID!): Collaborator!
  collaboratorChanged(sandboxId: ID!): Collaborator!
  collaboratorRemoved(sandboxId: ID!): Collaborator!
  commentAdded(sandboxId: ID!): Comment!
  commentChanged(sandboxId: ID!): Comment!
  commentRemoved(sandboxId: ID!): Comment!
  invitationChanged(sandboxId: ID!): Invitation!
  invitationCreated(sandboxId: ID!): Invitation!
  invitationRemoved(sandboxId: ID!): Invitation!
  sandboxChanged(sandboxId: ID!): Sandbox!
}

type Sandbox {
  alias: String
  author: User
  authorization: Authorization!
  collaborators: [Collaborator!]!
  collection: Collection
  comment(commentId: ID!): Comment
  comments: [Comment!]!

  customTemplate: Template
  description: String
  forkCount: Int!
  forkedTemplate: Template

  git: Git
  id: ID!
  insertedAt: String!
  invitations: [Invitation!]!
  likeCount: Int!
  privacy: Int!
  removedAt: String
  screenshotOutdated: Boolean!
  screenshotUrl: String
  source: Source!
  title: String
  updatedAt: String!
  viewCount: Int!
}

type Source {
  id: ID
  template: String
}

type Team {
  bookmarkedTemplates: [Template!]!
  collections: [Collection!]!
  creatorId: ID
  description: String
  id: ID!
  inviteToken: String!
  invitees: [User!]!
  name: String!
  templates: [Template!]!
  users: [User!]!
}

type Template {
  bookmarked: [Bookmarked]
  color: String
  description: String
  iconUrl: String
  id: ID
  insertedAt: String
  published: Boolean
  sandbox: Sandbox
  title: String
  updatedAt: String
}

type User {
  avatarUrl: String!
  firstName: String
  id: ID!
  lastName: String
  name: String
  username: String!
}
""" ∷
    String

testCS ∷ ∀ m. Monad m ⇒ SpecT Aff Unit m Unit
testCS =
  describe "test cs query" do
    before (parseDocument query)
      $ do
          it "should parse" \_ → do
            pure unit
