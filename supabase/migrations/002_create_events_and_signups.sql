-- Create events table with location and capacity management
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location_address TEXT NOT NULL,
  location_coordinates POINT,
  capacity INTEGER DEFAULT 10,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create time_slots table for event scheduling
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create volunteer_signups table for event participation tracking
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  time_slot_id UUID REFERENCES time_slots(id),
  event_id UUID REFERENCES events(id),
  flight_info JSONB,
  signed_up_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, time_slot_id)
);

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;

-- Events table policies
-- Policy: All authenticated users can read events
CREATE POLICY "All users can read events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Managers can create, update, and delete events
CREATE POLICY "Managers can manage events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can update events they are assigned to
CREATE POLICY "Lead volunteers can update assigned events" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Time slots table policies
-- Policy: All authenticated users can read time slots
CREATE POLICY "All users can read time slots" ON time_slots
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Managers can manage time slots
CREATE POLICY "Managers can manage time slots" ON time_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can manage time slots for their events
CREATE POLICY "Lead volunteers can manage event time slots" ON time_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Volunteer signups table policies
-- Policy: Users can read their own signups
CREATE POLICY "Users can read own signups" ON volunteer_signups
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own signups
CREATE POLICY "Users can create own signups" ON volunteer_signups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own signups
CREATE POLICY "Users can delete own signups" ON volunteer_signups
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Managers can read all signups
CREATE POLICY "Managers can read all signups" ON volunteer_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can read signups for their events
CREATE POLICY "Lead volunteers can read event signups" ON volunteer_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

CREATE INDEX IF NOT EXISTS idx_time_slots_event_id ON time_slots(event_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_start_time ON time_slots(start_time);

CREATE INDEX IF NOT EXISTS idx_volunteer_signups_user_id ON volunteer_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_time_slot_id ON volunteer_signups(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_event_id ON volunteer_signups(event_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_signed_up_at ON volunteer_signups(signed_up_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to update updated_at on events table
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check time slot capacity before signup
CREATE OR REPLACE FUNCTION check_time_slot_capacity()
RETURNS TRIGGER AS $
BEGIN
  -- Check if time slot has reached capacity
  IF (
    SELECT COUNT(*) 
    FROM volunteer_signups 
    WHERE time_slot_id = NEW.time_slot_id
  ) >= (
    SELECT capacity 
    FROM time_slots 
    WHERE id = NEW.time_slot_id
  ) THEN
    RAISE EXCEPTION 'Time slot has reached maximum capacity';
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to enforce time slot capacity
DROP TRIGGER IF EXISTS enforce_time_slot_capacity ON volunteer_signups;
CREATE TRIGGER enforce_time_slot_capacity
  BEFORE INSERT ON volunteer_signups
  FOR EACH ROW EXECUTE FUNCTION check_time_slot_capacity();