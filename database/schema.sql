-- CampusGenie Lite MySQL Database Schema
-- Production Ready Schema for Amazon RDS MySQL / Local MySQL

CREATE DATABASE IF NOT EXISTS campusgenie_db;
USE campusgenie_db;

-- 1. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    deadline DATE NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Study Tasks Table
CREATE TABLE IF NOT EXISTS study_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    planned_date DATE NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_name VARCHAR(100) DEFAULT 'Alex Rivera',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (event_id, user_name)
);

-- Sample Data Ingestion for Initial Setup

INSERT INTO assignments (title, subject, deadline, priority, status, description) VALUES
('Distributed Systems Architecture Report', 'Cloud Computing', '2026-08-05', 'High', 'In Progress', 'Design and analyze a 3-tier fault-tolerant cloud infrastructure on AWS.'),
('Database Normalization & Query Optimization', 'Database Management Systems', '2026-08-08', 'Medium', 'Pending', 'Optimize complex SQL JOIN queries and apply 3NF normalization rules.'),
('React State Management Case Study', 'Web Technologies', '2026-08-01', 'Low', 'Completed', 'Compare Redux Toolkit, Zustand, and React Context performance overhead.');

INSERT INTO study_tasks (task_name, subject, planned_date, priority, status) VALUES
('Review AWS Load Balancer & Target Groups', 'Cloud Computing', '2026-07-28', 'High', 'Pending'),
('Solve 5 LeetCode Graph & Dynamic Programming Problems', 'Algorithms', '2026-07-29', 'High', 'In Progress'),
('Read Chapter 4: B-Trees and Indexing Strategies', 'DBMS', '2026-07-30', 'Medium', 'Pending');

INSERT INTO events (title, date, location, description, category, registered) VALUES
('Annual Campus Hackathon 2026', '2026-08-15', 'Main Auditorium & Innovation Lab', '36-hour hackathon to build real-world AI, Cloud, and Web applications. $5,000 in prizes!', 'Hackathon', FALSE),
('AWS Cloud Practitioner & Solution Architect Workshop', '2026-08-03', 'Tech Park Seminar Hall B', 'Hands-on session covering EC2, RDS, VPCs, ALB, and Cloud Architecture best practices.', 'Workshop', TRUE),
('Tech Career Fair & Campus Placement Drive', '2026-08-20', 'Student Activity Center', 'Connect with top engineering recruiters, startup founders, and industry mentors.', 'Career', FALSE);
