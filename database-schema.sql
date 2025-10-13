CREATE TYPE category AS ENUM ('electronics', 'mechanical', 'chemical', 'optical', 'measurement', 'computer', 'general');

CREATE TYPE user_role AS ENUM ('admin', 'lab_staff', 'lecturer', 'student');

CREATE TYPE equipment_status AS ENUM ('available', 'borrowed', 'maintenance', 'retired');

CREATE TYPE transaction_status AS ENUM ('active', 'returned', 'overdue');

CREATE TYPE maintenance_type AS ENUM ('routine', 'repair', 'calibration', 'replacement');

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category category NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    phone TEXT,
    nim TEXT UNIQUE, -- Student ID number (required for students)
    nip TEXT UNIQUE, -- Staff ID number (required for staff/lecturers)
    student_level TEXT, -- For students: freshman, sophomore, junior, senior
    lecturer_rank TEXT, -- For lecturers: assistant, associate, professor
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_nim_nip CHECK (
        (role = 'student' AND nim IS NOT NULL AND nip IS NULL) OR
        (role IN ('lecturer', 'lab_staff', 'admin') AND nip IS NOT NULL AND nim IS NULL) OR
        (role NOT IN ('student', 'lecturer', 'lab_staff', 'admin'))
    )
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    serial_number TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id),
    location TEXT,
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    warranty_expiry DATE,
    status equipment_status DEFAULT 'available',
    condition TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE borrowing_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    equipment_id UUID REFERENCES equipment(id) NOT NULL,
    borrow_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    status transaction_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id) NOT NULL,
    maintenance_type maintenance_type NOT NULL,
    description TEXT NOT NULL,
    maintenance_date DATE NOT NULL,
    cost DECIMAL(10, 2),
    performed_by TEXT,
    next_maintenance_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE VIEW equipment_status_view AS
SELECT
    e.*,
    c.name as category_name,
    c.description as category_description,
    CASE
        WHEN bt.status = 'active' THEN 'borrowed'
        WHEN e.status = 'maintenance' THEN 'maintenance'
        ELSE 'available'
    END as current_status,
    CASE
        WHEN bt.status = 'active' THEN bt.expected_return_date
        ELSE NULL
    END as return_due_date
FROM equipment e
LEFT JOIN categories c ON e.category_id = c.id
LEFT JOIN borrowing_transactions bt ON e.id = bt.equipment_id AND bt.status = 'active';

CREATE VIEW user_borrowing_history AS
SELECT
    bt.*,
    u.full_name,
    u.email,
    u.department,
    u.role as user_role,
    e.name as equipment_name,
    e.serial_number,
    c.name as category_name
FROM borrowing_transactions bt
JOIN users u ON bt.user_id = u.id
JOIN equipment e ON bt.equipment_id = e.id
JOIN categories c ON e.category_id = c.id
ORDER BY bt.borrow_date DESC;

CREATE OR REPLACE FUNCTION update_equipment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE equipment SET status = 'borrowed' WHERE id = NEW.equipment_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'active' AND NEW.status = 'returned' THEN
            UPDATE equipment SET status = 'available' WHERE id = NEW.equipment_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_equipment_status_update
    AFTER INSERT OR UPDATE ON borrowing_transactions
    FOR EACH ROW EXECUTE FUNCTION update_equipment_status();

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_categories
    AFTER INSERT OR UPDATE OR DELETE ON categories
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_equipment
    AFTER INSERT OR UPDATE OR DELETE ON equipment
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_users
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_borrowing_transactions
    AFTER INSERT OR UPDATE OR DELETE ON borrowing_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_maintenance_records
    AFTER INSERT OR UPDATE OR DELETE ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE OR REPLACE FUNCTION check_equipment_availability()
RETURNS TRIGGER AS $$
DECLARE
    equipment_status_value TEXT;
BEGIN
    SELECT status INTO equipment_status_value FROM equipment WHERE id = NEW.equipment_id;

    IF equipment_status_value != 'available' THEN
        RAISE EXCEPTION 'Equipment is not available for borrowing';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_equipment_availability
    BEFORE INSERT ON borrowing_transactions
    FOR EACH ROW EXECUTE FUNCTION check_equipment_availability();

CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_borrowing_transactions_user ON borrowing_transactions(user_id);
CREATE INDEX idx_borrowing_transactions_equipment ON borrowing_transactions(equipment_id);
CREATE INDEX idx_borrowing_transactions_status ON borrowing_transactions(status);
CREATE INDEX idx_borrowing_transactions_dates ON borrowing_transactions(borrow_date, expected_return_date);
CREATE INDEX idx_maintenance_records_equipment ON maintenance_records(equipment_id);
CREATE INDEX idx_maintenance_records_date ON maintenance_records(maintenance_date);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowing_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;