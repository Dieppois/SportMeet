# Conception relationnelle SportMeet (MCD + MLD)

## 1) MCD textuel (entites, attributs, cles, relations)

- **User** (PK id) : email (uniq), password_hash, pseudo (uniq), first_name, last_name, birth_date?, city?, bio?, avatar_url?, profile_visibility (public|groups|private), account_status (active|suspended|banned|deleted), created_at, updated_at, deleted_at?.
- **OauthAccount** (PK id) : provider (google), provider_user_id, user_id (FK User.id), created_at. Relation User 1,N.
- **PasswordResetToken** (PK id) : user_id (FK User.id), token (uniq), expires_at, used_at?. Relation User 1,N.
- **Sport** (PK id) : code (uniq), name (uniq), created_at, updated_at. (liste fournie)
- **UserSport** (PK user_id + sport_id) : level (debutant|intermediaire|expert), created_at. Relation User 1,N vers UserSport; Sport 1,N vers UserSport.
- **Group** (PK id) : name, description?, city, sport_id (FK Sport.id), level (debutant|intermediaire|expert), visibility (public|private), max_members?, created_by (FK User.id), created_at, updated_at.
- **GroupMember** (PK id) : group_id (FK Group.id), user_id (FK User.id), role (owner|moderator|member), status (active|left|banned), joined_at, left_at?. Relation Group 1,N et User 1,N.
- **Activity** (PK id) : group_id (FK Group.id), sport_id (FK Sport.id), title, description?, start_at, end_at?, location, level (debutant|intermediaire|expert), max_participants?, status (draft|published|cancelled), created_by (FK User.id), created_at, updated_at, cancelled_at?.
- **ActivityParticipant** (PK id) : activity_id (FK Activity.id), user_id (FK User.id), status (invited|registered|declined|cancelled), invited_by (FK User.id?), registered_at?, cancelled_at?. Relation Activity 1,N et User 1,N.
- **ActivityRating** (PK id) : activity_id (FK Activity.id), rated_user_id (FK User.id), rater_user_id (FK User.id), score (1-5), comment?, created_at. (Note: on note l organisateur ou l activite selon besoin, ici l organisateur)
- **Conversation** (PK id) : type (activity|private), activity_id? (FK Activity.id, nullable sauf type activity), created_at.
- **ConversationParticipant** (PK id) : conversation_id (FK Conversation.id), user_id (FK User.id). Pour type=activity, liste derivee des participants.
- **Message** (PK id) : conversation_id (FK Conversation.id), sender_id (FK User.id), content, is_deleted (bool), is_approved (bool default true), created_at, updated_at.
- **MessageLike** (PK id) : message_id (FK Message.id), user_id (FK User.id), created_at.
- **ContentReport** (PK id) : target_type (message), target_id (FK Message.id), reporter_id (FK User.id), status (open|in_review|resolved|rejected), reason, created_at, resolved_by (FK User.id?), resolved_at?.
- **Notification** (PK id) : user_id (FK User.id), type (activity_created|activity_signup|group_created|message|other), entity_type, entity_id, payload_json, read_at?, created_at.
- **NotificationPreference** (PK user_id) : user_id (FK User.id), activity_notif (bool), message_notif (bool), group_notif (bool), created_at, updated_at.
- **UserBan** (PK id) : user_id (FK User.id), banned_by (FK User.id), reason, status (active|lifted), starts_at, ends_at?, created_at, lifted_at?.

Relations principales :  
User 1,N Group (via created_by), User N,N Sport (via UserSport), User N,N Group (via GroupMember), Group 1,N Activity, Activity N,N User (via ActivityParticipant), Activity 1,1 Conversation (type=activity), Conversation N,N User (ConversationParticipant), Conversation 1,N Message, Message N,N User (MessageLike), Message 1,N ContentReport, User 1,N Notification, User 1,1 NotificationPreference, User 1,N UserBan, User 1,N ActivityRating (rater), User 1,N ActivityRating (rated).

## 2) MLD relationnel (tables, colonnes, types, contraintes)

- `users` (PK id int AI, email varchar(255) uniq, password_hash varchar(255), pseudo varchar(50) uniq, first_name varchar(100), last_name varchar(100), birth_date date null, city varchar(100) null, bio text null, avatar_url varchar(255) null, profile_visibility enum('public','groups','private') default 'public', account_status enum('active','suspended','banned','deleted') default 'active', created_at datetime, updated_at datetime, deleted_at datetime null)
- `oauth_accounts` (PK id int AI, user_id int FK users(id) on delete cascade, provider enum('google'), provider_user_id varchar(255), created_at datetime, uniq(user_id, provider))
- `password_reset_tokens` (PK id int AI, user_id int FK users(id) on delete cascade, token char(64) uniq, expires_at datetime, used_at datetime null, created_at datetime)
- `sports` (PK id int AI, code varchar(80) uniq, name varchar(120) uniq, created_at datetime, updated_at datetime)
- `user_sports` (PK (user_id, sport_id), user_id int FK users(id) on delete cascade, sport_id int FK sports(id) on delete cascade, level enum('debutant','intermediaire','expert'), created_at datetime)
- `groups` (PK id int AI, name varchar(120), description text null, city varchar(100), sport_id int FK sports(id), level enum('debutant','intermediaire','expert'), visibility enum('public','private') default 'public', max_members int null check (max_members > 0), created_by int FK users(id), created_at datetime, updated_at datetime)
- `group_members` (PK id int AI, group_id int FK groups(id) on delete cascade, user_id int FK users(id) on delete cascade, role enum('owner','moderator','member') default 'member', status enum('active','left','banned') default 'active', joined_at datetime, left_at datetime null, uniq(group_id,user_id))
- `activities` (PK id int AI, group_id int FK groups(id) on delete cascade, sport_id int FK sports(id), title varchar(150), description text null, start_at datetime, end_at datetime null, location varchar(255), level enum('debutant','intermediaire','expert'), max_participants int null check (max_participants > 0), status enum('draft','published','cancelled') default 'published', created_by int FK users(id), created_at datetime, updated_at datetime, cancelled_at datetime null)
- `activity_participants` (PK id int AI, activity_id int FK activities(id) on delete cascade, user_id int FK users(id) on delete cascade, status enum('invited','registered','declined','cancelled') default 'registered', invited_by int null FK users(id), registered_at datetime null, cancelled_at datetime null, uniq(activity_id,user_id))
- `activity_ratings` (PK id int AI, activity_id int FK activities(id) on delete cascade, rated_user_id int FK users(id), rater_user_id int FK users(id), score tinyint check (score between 1 and 5), comment text null, created_at datetime, uniq(activity_id,rated_user_id,rater_user_id))
- `conversations` (PK id int AI, type enum('activity','private'), activity_id int null FK activities(id) on delete cascade, created_at datetime, uniq(activity_id) where type='activity')
- `conversation_participants` (PK id int AI, conversation_id int FK conversations(id) on delete cascade, user_id int FK users(id) on delete cascade, uniq(conversation_id,user_id))
- `messages` (PK id int AI, conversation_id int FK conversations(id) on delete cascade, sender_id int FK users(id), content text, is_deleted bool default false, is_approved bool default true, created_at datetime, updated_at datetime, index(conversation_id), index(sender_id))
- `message_likes` (PK id int AI, message_id int FK messages(id) on delete cascade, user_id int FK users(id) on delete cascade, created_at datetime, uniq(message_id,user_id))
- `content_reports` (PK id int AI, target_type enum('message'), target_id int, reporter_id int FK users(id), status enum('open','in_review','resolved','rejected') default 'open', reason varchar(255), created_at datetime, resolved_by int null FK users(id), resolved_at datetime null, index(target_type,target_id))
- `notifications` (PK id int AI, user_id int FK users(id) on delete cascade, type enum('activity_created','activity_signup','group_created','message','custom'), entity_type varchar(50), entity_id int, payload_json json, read_at datetime null, created_at datetime, index(user_id,read_at))
- `notification_preferences` (PK user_id int FK users(id) on delete cascade, activity_notif bool default true, message_notif bool default true, group_notif bool default true, created_at datetime, updated_at datetime)
- `user_bans` (PK id int AI, user_id int FK users(id) on delete cascade, banned_by int FK users(id), reason varchar(255), status enum('active','lifted') default 'active', starts_at datetime, ends_at datetime null, lifted_at datetime null, created_at datetime)

## 3) Notes d architecte (choix et evolutions)

- **Normalisation 3NF** : pivot tables (`user_sports`, `group_members`, `activity_participants`, `conversation_participants`, `message_likes`) evitent la duplication et permettent les recherches par sport/niveau/ville.
- **Securite et nettoyage** : `on delete cascade` sur les entites enfants pour respecter la suppression du compte (US-006). `content_reports` + `is_approved` couvrent la moderation (US-036/037/038/039). `user_bans` et `account_status` couvrent suspension/bannissement (US-040/041/043).
- **Notifications et preferences** : `notification_preferences` couvre le filtrage (US-034). `notifications` flexible via `entity_type/entity_id/payload_json` pour supporter nouveaux types (groupes, activites, messages).
- **Visibilite profil** : `profile_visibility` sur `users` (US-044). L API filtrera les champs selon la valeur.
- **Chat et likes** : `conversations` supporte chat d activite (type=activity) et MP (type=private) (US-026/029/030). `message_likes` pour les likes (US-029). `conversation_participants` gere l acces.
- **Activites** : `activity_participants` stocke invites/inscriptions/desinscriptions (US-018/019/020). `max_participants` + compteur derive pour US-021. `status` + `cancelled_at` pour annulation (US-022). `activity_ratings` pour notes (US-024). `start_at/end_at` alimentent calendrier (US-025).
- **Groupes** : `groups` indexes sur sport/level/city pour recherche (US-013). `group_members` role permet promotion/moderation (US-035) et liste des membres (US-014).
- **Evolutions possibles** : ajouter `locations` geolocalisees (lat/lng) pour matching par distance, `group_join_requests` pour validation d entree, `attachments` sur messages, `recurring_activities`, `audit_logs` pour traçabilite admin, `device_tokens` pour push.
