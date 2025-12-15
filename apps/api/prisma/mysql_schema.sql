-- Schema MySQL pour SportMeet
-- Inclut la creation des tables, contraintes, index et un jeu d inserts de demo

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Tables de base
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  pseudo VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NULL,
  birth_date DATE NULL,
  city VARCHAR(100) NULL,
  bio TEXT NULL,
  avatar_url VARCHAR(255) NULL,
  profile_visibility ENUM('public','groups','private') NOT NULL DEFAULT 'public',
  account_status ENUM('active','suspended','banned','deleted') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider ENUM('google') NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_provider (user_id, provider),
  CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reference sports
CREATE TABLE sports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_sports (
  user_id INT NOT NULL,
  sport_id INT NOT NULL,
  level ENUM('debutant','intermediaire','expert') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, sport_id),
  CONSTRAINT fk_user_sport_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_sport_sport FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Groupes
CREATE TABLE `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  city VARCHAR(100) NOT NULL,
  sport_id INT NOT NULL,
  level ENUM('debutant','intermediaire','expert') NOT NULL,
  visibility ENUM('public','private') NOT NULL DEFAULT 'public',
  max_members INT NULL CHECK (max_members > 0),
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group_search (sport_id, level, city),
  CONSTRAINT fk_group_sport FOREIGN KEY (sport_id) REFERENCES sports(id),
  CONSTRAINT fk_group_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE group_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner','moderator','member') NOT NULL DEFAULT 'member',
  status ENUM('active','left','banned') NOT NULL DEFAULT 'active',
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at DATETIME NULL,
  UNIQUE KEY uq_group_user (group_id, user_id),
  INDEX idx_group_members_user (user_id),
  CONSTRAINT fk_group_member_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  CONSTRAINT fk_group_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Activites
CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  sport_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NULL,
  location VARCHAR(255) NOT NULL,
  level ENUM('debutant','intermediaire','expert') NOT NULL,
  max_participants INT NULL CHECK (max_participants > 0),
  status ENUM('draft','published','cancelled') NOT NULL DEFAULT 'published',
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  cancelled_at DATETIME NULL,
  INDEX idx_activity_group (group_id),
  INDEX idx_activity_time (start_at),
  CONSTRAINT fk_activity_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  CONSTRAINT fk_activity_sport FOREIGN KEY (sport_id) REFERENCES sports(id),
  CONSTRAINT fk_activity_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activity_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('invited','registered','declined','cancelled') NOT NULL DEFAULT 'registered',
  invited_by INT NULL,
  registered_at DATETIME NULL,
  cancelled_at DATETIME NULL,
  UNIQUE KEY uq_activity_user (activity_id, user_id),
  INDEX idx_activity_participants_user (user_id),
  CONSTRAINT fk_participant_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  CONSTRAINT fk_participant_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_participant_inviter FOREIGN KEY (invited_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activity_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  rated_user_id INT NOT NULL,
  rater_user_id INT NOT NULL,
  score TINYINT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_rating (activity_id, rated_user_id, rater_user_id),
  CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 5),
  CONSTRAINT fk_rating_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  CONSTRAINT fk_rating_rated FOREIGN KEY (rated_user_id) REFERENCES users(id),
  CONSTRAINT fk_rating_rater FOREIGN KEY (rater_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Conversations et messages
CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('activity','private') NOT NULL,
  activity_id INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_activity_conversation (activity_id),
  CONSTRAINT fk_conversation_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE conversation_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  UNIQUE KEY uq_conversation_user (conversation_id, user_id),
  INDEX idx_conversation_user (user_id),
  CONSTRAINT fk_conv_part_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_conv_part_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_messages_conversation (conversation_id),
  INDEX idx_messages_sender (sender_id),
  CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE message_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_like (message_id, user_id),
  CONSTRAINT fk_like_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE content_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  target_type ENUM('message') NOT NULL,
  target_id INT NOT NULL,
  reporter_id INT NOT NULL,
  status ENUM('open','in_review','resolved','rejected') NOT NULL DEFAULT 'open',
  reason VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_by INT NULL,
  resolved_at DATETIME NULL,
  INDEX idx_report_target (target_type, target_id),
  CONSTRAINT fk_report_message FOREIGN KEY (target_id) REFERENCES messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES users(id),
  CONSTRAINT fk_report_resolver FOREIGN KEY (resolved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('activity_created','activity_signup','group_created','message','custom') NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NULL,
  payload_json JSON NULL,
  read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user_read (user_id, read_at),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notification_preferences (
  user_id INT PRIMARY KEY,
  activity_notif BOOLEAN NOT NULL DEFAULT TRUE,
  message_notif BOOLEAN NOT NULL DEFAULT TRUE,
  group_notif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bannissements / suspensions
CREATE TABLE user_bans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  banned_by INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status ENUM('active','lifted') NOT NULL DEFAULT 'active',
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NULL,
  lifted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ban_user (user_id),
  CONSTRAINT fk_ban_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ban_by FOREIGN KEY (banned_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Jeu d inserts pour tests
-- ---------------------------------------------------------------------------

-- Sports (liste fournie)
INSERT INTO sports (code, name) VALUES
('football','Football'),
('beach-soccer','Beach soccer'),
('futsal','Futsal'),
('basketball','Basketball'),
('handball','Handball'),
('rugby','Rugby'),
('football-americain','Football americain'),
('baseball','Baseball'),
('softball','Softball'),
('ultimate','Ultimate (frisbee)'),
('volley-ball','Volley-ball'),
('beach-volley','Beach-volley'),
('tennis','Tennis'),
('padel','Padel'),
('tennis-de-table','Tennis de table'),
('badminton','Badminton'),
('squash','Squash'),
('course-a-pied','Course a pied'),
('trail','Trail'),
('athletisme','Athletisme'),
('natation','Natation'),
('water-polo','Water-polo'),
('surf','Surf'),
('voile','Voile'),
('canoe-kayak','Canoe-kayak'),
('aviron','Aviron'),
('cyclisme-route','Cyclisme sur route'),
('vtt','VTT'),
('bmx','BMX'),
('skateboard','Skateboard'),
('roller','Roller'),
('trotinette','Trotinette'),
('triathlon','Triathlon'),
('musculation','Musculation');

-- Utilisateurs
INSERT INTO users (email, password_hash, pseudo, first_name, last_name, city, profile_visibility, account_status)
VALUES
('alice@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'alice33', 'Alice', 'Durand', 'Bordeaux', 'public', 'active'),
('bob@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'bobinho', 'Bob', 'Martin', 'Bordeaux', 'groups', 'active'),
('clara@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'clara', 'Clara', 'Bernard', 'Bordeaux', 'private', 'active');

-- Connexion Google pour Bob
INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
VALUES (2, 'google', 'google-oauth-uid-bob');

-- Preferences de notif
INSERT INTO notification_preferences (user_id, activity_notif, message_notif, group_notif)
VALUES
(1, TRUE, TRUE, TRUE),
(2, TRUE, TRUE, FALSE),
(3, TRUE, FALSE, TRUE);

-- Sports des utilisateurs
INSERT INTO user_sports (user_id, sport_id, level) VALUES
(1, 1, 'debutant'),
(1, 13, 'intermediaire'),
(2, 1, 'intermediaire'),
(2, 11, 'intermediaire'),
(3, 1, 'expert'),
(3, 14, 'debutant');

-- Groupes
INSERT INTO `groups` (name, description, city, sport_id, level, visibility, max_members, created_by)
VALUES
('Foot Bordeaux Debutant', 'Matchs amicaux le soir', 'Bordeaux', 1, 'debutant', 'public', 50, 1),
('Tennis Bordeaux Inter', 'Partenaires tennis niveau inter', 'Bordeaux', 13, 'intermediaire', 'private', 30, 3);

-- Membres des groupes
INSERT INTO group_members (group_id, user_id, role, status) VALUES
(1, 1, 'owner', 'active'),
(1, 2, 'member', 'active'),
(1, 3, 'moderator', 'active'),
(2, 3, 'owner', 'active'),
(2, 1, 'member', 'active');

-- Activites
INSERT INTO activities (group_id, sport_id, title, description, start_at, end_at, location, level, max_participants, status, created_by)
VALUES
(1, 1, 'Foot du mercredi', 'Terrain synth et match 7v7', '2025-01-20 19:00:00', '2025-01-20 21:00:00', 'Stade Chaban', 'debutant', 14, 'published', 1),
(1, 1, 'Foot du dimanche', 'Match detente', '2025-01-26 10:00:00', '2025-01-26 12:00:00', 'Parc Bordelais', 'debutant', 12, 'cancelled', 1);

-- Participants activites
INSERT INTO activity_participants (activity_id, user_id, status, invited_by, registered_at)
VALUES
(1, 1, 'registered', NULL, NOW()),
(1, 2, 'registered', 1, NOW()),
(1, 3, 'invited', 1, NULL),
(2, 2, 'registered', 1, NOW());

-- Notes
INSERT INTO activity_ratings (activity_id, rated_user_id, rater_user_id, score, comment)
VALUES
(1, 1, 2, 5, 'Organisation nickel'),
(1, 2, 1, 4, 'Bon esprit'),
(1, 3, 1, 4, 'Motivation au top');

-- Conversation d activite + MP
INSERT INTO conversations (type, activity_id) VALUES
('activity', 1),
('private', NULL);

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(1, 1), (1, 2), (1, 3),  -- chat activite
(2, 1), (2, 2);          -- MP Alice/Bob

INSERT INTO messages (conversation_id, sender_id, content) VALUES
(1, 1, 'Salut, qui apporte les chasubles ?'),
(1, 2, 'Je m en occupe.'),
(1, 3, 'Je prends les ballons.'),
(2, 1, 'On covoiture ?'),
(2, 2, 'Oui rdv 18h45.');

INSERT INTO message_likes (message_id, user_id) VALUES
(2, 1),
(3, 1),
(1, 2);

INSERT INTO content_reports (target_type, target_id, reporter_id, reason)
VALUES ('message', 5, 1, 'Hors sujet');

-- Notifications
INSERT INTO notifications (user_id, type, entity_type, entity_id, payload_json, read_at)
VALUES
(2, 'activity_created', 'activity', 1, JSON_OBJECT('title','Foot du mercredi'), NULL),
(1, 'activity_signup', 'activity', 1, JSON_OBJECT('user','bobinho'), NULL),
(1, 'message', 'message', 2, JSON_OBJECT('from','bobinho'), NOW());

-- Bannissement (exemple leve)
INSERT INTO user_bans (user_id, banned_by, reason, status, starts_at, ends_at, lifted_at)
VALUES (3, 1, 'Spam', 'lifted', '2024-12-01 00:00:00', '2024-12-15 00:00:00', '2024-12-10 00:00:00');

