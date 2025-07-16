-- Create checklist_templates table for role-based checklists
CREATE TABLE IF NOT EXISTS checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('manager', 'lead', 'volunteer')) NOT NULL,
  items JSONB NOT NULL,
  event_type VARCHAR,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create checklist_progress table for tracking completion
CREATE TABLE IF NOT EXISTS checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  template_id UUID REFERENCES checklist_templates(id) NOT NULL,
  completed_items JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id, template_id)
);

-- Create package_tracking table for USPS integration
CREATE TABLE IF NOT EXISTS package_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number VARCHAR UNIQUE NOT NULL,
  from_event_id UUID REFERENCES events(id),
  to_event_id UUID REFERENCES events(id),
  recipient_user_id UUID REFERENCES users(id) NOT NULL,
  status VARCHAR DEFAULT 'shipped',
  estimated_delivery DATE,
  actual_delivery DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create event_attachments table for file storage
CREATE TABLE IF NOT EXISTS event_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Create after_action_reports table for lead volunteer feedback
CREATE TABLE IF NOT EXISTS after_action_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  report_data JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  status VARCHAR CHECK (status IN ('submitted', 'reviewed', 'archived')) DEFAULT 'submitted',
  UNIQUE(event_id, submitted_by)
);

-- Enable RLS on all tables
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE after_action_reports ENABLE ROW LEVEL SECURITY;

-- Checklist templates policies
-- Policy: All authenticated users can read checklist templates
CREATE POLICY "All users can read checklist templates" ON checklist_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Managers can manage checklist templates
CREATE POLICY "Managers can manage checklist templates" ON checklist_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Checklist progress policies
-- Policy: Users can read their own checklist progress
CREATE POLICY "Users can read own checklist progress" ON checklist_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own checklist progress
CREATE POLICY "Users can update own checklist progress" ON checklist_progress
  FOR ALL USING (auth.uid() = user_id);

-- Policy: Managers can read all checklist progress
CREATE POLICY "Managers can read all checklist progress" ON checklist_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can read checklist progress for their events
CREATE POLICY "Lead volunteers can read event checklist progress" ON checklist_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Package tracking policies
-- Policy: Managers can read all package tracking
CREATE POLICY "Managers can read all package tracking" ON package_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Managers can manage package tracking
CREATE POLICY "Managers can manage package tracking" ON package_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can read packages for their events
CREATE POLICY "Lead volunteers can read relevant packages" ON package_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    ) AND (
      recipient_user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM volunteer_signups vs
        WHERE vs.user_id = auth.uid() 
        AND (vs.event_id = from_event_id OR vs.event_id = to_event_id)
      )
    )
  );

-- Policy: Recipients can read their own packages
CREATE POLICY "Recipients can read own packages" ON package_tracking
  FOR SELECT USING (auth.uid() = recipient_user_id);

-- Event attachments policies
-- Policy: All authenticated users can read event attachments
CREATE POLICY "All users can read event attachments" ON event_attachments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Managers can manage event attachments
CREATE POLICY "Managers can manage event attachments" ON event_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can manage attachments for their events
CREATE POLICY "Lead volunteers can manage event attachments" ON event_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Policy: Users can upload attachments to events they're signed up for
CREATE POLICY "Users can upload to signed up events" ON event_attachments
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM volunteer_signups 
      WHERE user_id = auth.uid() AND event_id = event_attachments.event_id
    )
  );

-- After action reports policies
-- Policy: Lead volunteers can read and create their own reports
CREATE POLICY "Lead volunteers can manage own reports" ON after_action_reports
  FOR ALL USING (
    auth.uid() = submitted_by AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Policy: Managers can read all reports
CREATE POLICY "Managers can read all reports" ON after_action_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Managers can review reports
CREATE POLICY "Managers can review reports" ON after_action_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checklist_templates_role ON checklist_templates(role);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_event_type ON checklist_templates(event_type);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_created_by ON checklist_templates(created_by);

CREATE INDEX IF NOT EXISTS idx_checklist_progress_user_id ON checklist_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_event_id ON checklist_progress(event_id);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_template_id ON checklist_progress(template_id);

CREATE INDEX IF NOT EXISTS idx_package_tracking_number ON package_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_package_tracking_recipient ON package_tracking(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_package_tracking_from_event ON package_tracking(from_event_id);
CREATE INDEX IF NOT EXISTS idx_package_tracking_to_event ON package_tracking(to_event_id);
CREATE INDEX IF NOT EXISTS idx_package_tracking_status ON package_tracking(status);

CREATE INDEX IF NOT EXISTS idx_event_attachments_event_id ON event_attachments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attachments_uploaded_by ON event_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_event_attachments_file_type ON event_attachments(file_type);

CREATE INDEX IF NOT EXISTS idx_after_action_reports_event_id ON after_action_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_after_action_reports_submitted_by ON after_action_reports(submitted_by);
CREATE INDEX IF NOT EXISTS idx_after_action_reports_status ON after_action_reports(status);

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_checklist_templates_updated_at ON checklist_templates;
CREATE TRIGGER update_checklist_templates_updated_at
  BEFORE UPDATE ON checklist_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_checklist_progress_updated_at ON checklist_progress;
CREATE TRIGGER update_checklist_progress_updated_at
  BEFORE UPDATE ON checklist_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_package_tracking_updated_at ON package_tracking;
CREATE TRIGGER update_package_tracking_updated_at
  BEFORE UPDATE ON package_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create checklist progress when user signs up for event
CREATE OR REPLACE FUNCTION create_checklist_progress_on_signup()
RETURNS TRIGGER AS $
BEGIN
  -- Create checklist progress entries for all applicable templates
  INSERT INTO checklist_progress (user_id, event_id, template_id)
  SELECT 
    NEW.user_id,
    NEW.event_id,
    ct.id
  FROM checklist_templates ct
  JOIN users u ON u.id = NEW.user_id
  WHERE ct.role = u.role
  ON CONFLICT (user_id, event_id, template_id) DO NOTHING;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to create checklist progress on volunteer signup
DROP TRIGGER IF EXISTS create_checklist_on_signup ON volunteer_signups;
CREATE TRIGGER create_checklist_on_signup
  AFTER INSERT ON volunteer_signups
  FOR EACH ROW EXECUTE FUNCTION create_checklist_progress_on_signup();

-- Function to validate package tracking number format
CREATE OR REPLACE FUNCTION validate_tracking_number()
RETURNS TRIGGER AS $
BEGIN
  -- Basic validation for USPS tracking numbers (simplified)
  IF NEW.tracking_number !~ '^[0-9]{20,22}$|^[A-Z]{2}[0-9]{9}[A-Z]{2}$' THEN
    RAISE EXCEPTION 'Invalid tracking number format';
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to validate tracking numbers
DROP TRIGGER IF EXISTS validate_package_tracking_number ON package_tracking;
CREATE TRIGGER validate_package_tracking_number
  BEFORE INSERT OR UPDATE ON package_tracking
  FOR EACH ROW EXECUTE FUNCTION validate_tracking_number();