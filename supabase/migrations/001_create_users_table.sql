-- Create users table with all required fields for authentication and profile management
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  role VARCHAR CHECK (role IN ('manager', 'lead', 'volunteer')) DEFAULT 'volunteer',
  pilot_training_status VARCHAR CHECK (pilot_training_status IN ('Initial(PPL, IR, Comm)', 'CFI/CFII', 'Airline Pilot-ATP')),
  location_type VARCHAR CHECK (location_type IN ('local', 'traveling')),
  can_provide_pickup BOOLEAN DEFAULT FALSE,
  needs_travel_voucher BOOLEAN DEFAULT FALSE,
  hotel_info TEXT,
  shipping_address JSONB, -- For lead volunteers
  discord_profile JSONB,
  google_profile JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Managers can read all user profiles
CREATE POLICY "Managers can read all profiles" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Managers can update user roles
CREATE POLICY "Managers can update user roles" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Lead volunteers can read profiles of volunteers in their events
CREATE POLICY "Lead volunteers can read event volunteers" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'lead'
    )
  );

-- Function to handle user creation/update after OAuth sign in
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, google_profile, discord_profile)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' 
      THEN NEW.raw_user_meta_data 
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'discord' 
      THEN NEW.raw_user_meta_data 
      ELSE NULL 
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    google_profile = CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' 
      THEN EXCLUDED.google_profile 
      ELSE users.google_profile 
    END,
    discord_profile = CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'discord' 
      THEN EXCLUDED.discord_profile 
      ELSE users.discord_profile 
    END,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create/update user profile after OAuth sign in
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);