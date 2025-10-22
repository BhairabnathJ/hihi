-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Organizations Policies
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id = auth.user_organization_id());

CREATE POLICY "Organization admins can update their organization"
  ON organizations FOR UPDATE
  USING (
    id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

-- Users Policies
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can insert users in their organization"
  ON users FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users in their organization"
  ON users FOR DELETE
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Projects Policies
CREATE POLICY "Users can view projects in their organization"
  ON projects FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Managers and admins can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Project owners and admins can update projects"
  ON projects FOR UPDATE
  USING (
    organization_id = auth.user_organization_id() AND
    (
      owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks Policies
CREATE POLICY "Users can view tasks in their organization's projects"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can create tasks in their organization's projects"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can update tasks they created or are assigned to"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.organization_id = auth.user_organization_id()
    ) AND
    (
      created_by = auth.uid() OR
      assignee_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Task creators and managers can delete tasks"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.organization_id = auth.user_organization_id()
    ) AND
    (
      created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

-- Task Dependencies Policies
CREATE POLICY "Users can view task dependencies in their organization"
  ON task_dependencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_dependencies.task_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

-- Contacts Policies
CREATE POLICY "Users can view contacts in their organization"
  ON contacts FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can create contacts in their organization"
  ON contacts FOR INSERT
  WITH CHECK (organization_id = auth.user_organization_id());

CREATE POLICY "Users can update contacts in their organization"
  ON contacts FOR UPDATE
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Donations Policies
CREATE POLICY "Users can view donations in their organization"
  ON donations FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Authorized users can manage donations"
  ON donations FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Grants Policies
CREATE POLICY "Users can view grants in their organization"
  ON grants FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Managers and admins can manage grants"
  ON grants FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Time Entries Policies
CREATE POLICY "Users can view their own time entries and managers can view all"
  ON time_entries FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create their own time entries"
  ON time_entries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own time entries"
  ON time_entries FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own time entries"
  ON time_entries FOR DELETE
  USING (user_id = auth.uid());

-- Shifts Policies
CREATE POLICY "Users can view shifts in their organization"
  ON shifts FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Managers can manage shifts"
  ON shifts FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Comments Policies
CREATE POLICY "Users can view comments on tasks in their organization"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = comments.task_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can create comments on tasks in their organization"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = comments.task_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (user_id = auth.uid());

-- Attachments Policies
CREATE POLICY "Users can view attachments in their organization"
  ON attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = attachments.task_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can create attachments"
  ON attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = attachments.task_id 
      AND projects.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can delete their own attachments"
  ON attachments FOR DELETE
  USING (user_id = auth.uid());

-- Activities Policies
CREATE POLICY "Users can view activities in their organization"
  ON activities FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "System can create activities"
  ON activities FOR INSERT
  WITH CHECK (organization_id = auth.user_organization_id());

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Teams Policies
CREATE POLICY "Users can view teams in their organization"
  ON teams FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Managers can manage teams"
  ON teams FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Team Members Policies
CREATE POLICY "Users can view team members in their organization"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Managers can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.organization_id = auth.user_organization_id()
      AND EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );
